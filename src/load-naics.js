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
  const mapped = _.map(concepts, (item) => {
    const { termId, label } = helper.parsePrefLabel(item);
    return {
      _id: termId,
      label,
      code: codeMap[termId],
    };
  });

  yield models.NaicsCode.remove({});
  yield models.NaicsCode.create(mapped);
}

module.exports = loadNaics;
