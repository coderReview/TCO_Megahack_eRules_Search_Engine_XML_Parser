/**
 * Parse XML and populate Program
 */

const path = require('path');
const _ = require('lodash');
const config = require('../config');
const models = require('./models');
const helper = require('./helper');

const minCAA = 50;
const maxCAA = 98;

/**
 * Load programs
 */
function* loadPrograms() {
  const xmlPath = path.join(config.baseDir, config.programXmlFile);
  const { concepts } = yield helper.parseSkosXML(xmlPath);
  // parse programs
  const mappedPrograms = _.map(concepts, (item) => {
    const { termId, label } = helper.parsePrefLabel(item);
    return {
      _id: termId,
      name: label,
      regulations: [],
    };
  });
  const map = _.keyBy(mappedPrograms, '_id');
  const regulationMap = {};

  const regulations = yield helper.loadRegulations();
  _.forEach(regulations, (item) => {
    // find references between programs and regulations
    _.forEach(item.concepts, (concept) => {
      const termId = _.get(concept, 'zthes:termID[0]');
      regulationMap[termId] = { _id: termId };

      if (concept['skm:PC']) {
        let programId = _.get(concept, 'skm:PC[0].$.rdf:resource');
        let ref = _.get(concept, 'skm:PC[0].$.rdf:ID');
        if (programId && ref) {
          // example #3796070
          programId = programId.replace('#', '');
          // example r3813480-3796070
          ref = ref.split('-')[0].replace('r', '');
          if (map[programId]) {
            map[programId].regulations.push(ref);
          }
        }
      }
    });

    // parse regulations
    _.forEach(item.descriptions, (desc) => {
      const about = _.get(desc, '$.rdf:about');
      const label = _.get(desc, 'zthes:label[0]');
      if (!about || !label) {
        return;
      }
      const split = about.split('-');
      const id = split[1];
      if (!regulationMap[id]) {
        return;
      }
      if (split[0] === 'Title') {
        regulationMap[id].title = label;
      } else if (split[0] === 'URL') {
        regulationMap[id].url = label;
      } else if (split[0] === 'Heading') {
        const exec = /Part (\d+)/.exec(label);
        if (exec) {
          const part = exec[1];
          regulationMap[id].isCAA = part >= minCAA && part <= maxCAA;
        }
      }
    });
  });

  // remove incomplete regulations
  _.forEach(regulationMap, (value, id) => {
    if (!value.title) {
      delete regulationMap[id];
    }
  });

  // check if references exists
  _.forEach(mappedPrograms, (program) => {
    program.regulations = _(program.regulations)
      .map((id) => regulationMap[id])
      .compact()
      .map('_id')
      .value();
  });

  yield models.Program.remove({});
  yield models.Program.create(mappedPrograms);

  yield models.Regulation.remove({});
  yield models.Regulation.create(_.values(regulationMap));
}

module.exports = loadPrograms;
