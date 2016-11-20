/**
 * Parse XML and populate Program
 */

const path = require('path');
const _ = require('lodash');
const config = require('../config');
const models = require('./models');
const helper = require('./helper');

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
      regulations: []
    };
  });
  const map = _.keyBy(mappedPrograms, '_id');

  const regulations = yield helper.loadRegulations();

  _.forEach(regulations, (item) => {
    // find references between programs and regulations
    _.forEach(item.concepts, (concept) => {
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
  });

  var regulationMap = yield models.Regulation.find();

  // check if references exists
  _.forEach(mappedPrograms, (program) => {
    program.regulations = _(program.regulations)
      .map((id) => regulationMap.find(obj => obj.id === id))
      .compact()
      .map('_id')
      .value();
  });

  yield models.Program.remove({});
  yield models.Program.create(mappedPrograms);
}

module.exports = loadPrograms;
