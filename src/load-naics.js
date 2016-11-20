/**
 * Parse XML and populate NaicsCode
 */

const path = require('path');
const _ = require('lodash');
const config = require('../config');
const models = require('./models');
const helper = require('./helper');

/**
 * Load NAICS codes
 */
function* loadNaics() {
  const xmlPath = path.join(config.baseDir, config.naicsXmlFile);
  const { concepts, descriptions } = yield helper.parseSkosXML(xmlPath);
  const codeMap = {};
  // check for NAICSUSCode descriptions
  // ignore invalid/missing entries
  _.forEach(descriptions, (desc) => {
    const id = _.get(desc, '$.rdf:about');
    if (!id) {
      return;
    }
    const split = id.split('-');
    const termId = split[1];
    if (split[0] !== 'NAICSUSCode' || !termId) {
      return;
    }
    const code = _.get(desc, 'zthes:label[0]');
    if (code) {
      codeMap[termId] = code;
    }
  });

  // parse NAICS
  const mapped = _.map(concepts, (item) => {
    const { termId, label } = helper.parsePrefLabel(item);
    return {
      _id: termId,
      label,
      code: codeMap[termId],
      regulations: []
    };
  });
  const map = _.keyBy(mapped, '_id');

  const regulations = yield helper.loadRegulations();
  _.forEach(regulations, (item) => {
    // find references between programs and regulations
    _.forEach(item.concepts, (concept) => {
      let nc = concept['skm:NC'];
      if (nc) {
        console.log('NCs: ' + nc.length);
        for (var index = 0; index < nc.length; index++) {
          let naicsId = _.get(concept, 'skm:NC['+index+'].$.rdf:resource');
          let ref = _.get(concept, 'skm:NC['+index+'].$.rdf:ID');
          if (naicsId && ref) {
            console.log('Found NAICS :' + naicsId);
            console.log('Ref:' + ref);
            // example #3796070
            naicsId = naicsId.replace('#', '');
            // example r3813480-3796070
            ref = ref.split('-')[0].replace('r', '');
            if (map[naicsId]) {
              map[naicsId].regulations.push(ref);
              console.log('Added regulation with ref: ' + ref);
            }
          }
        }
      }
    });
  });

  var regulationMap = yield models.Regulation.find();

  // check if references exists
  _.forEach(mapped, (naics) => {
    naics.regulations = _(naics.regulations)
      .map((id) => regulationMap.find(obj => obj.id === id))
      .compact()
      .map('_id')
      .value();
  });


  yield models.NaicsCode.remove({});
  yield models.NaicsCode.create(mapped);
}

module.exports = loadNaics;
