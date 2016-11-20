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

var isLoaded = false;

/**
 * Load regulations
 */
function* loadRegulations() {
  if (isLoaded) return;

  const regulationMap = {};

  const regulations = yield helper.loadRegulations();
  _.forEach(regulations, (item) => {
    _.forEach(item.concepts, (concept) => {
      const termId = _.get(concept, 'zthes:termID[0]');
      regulationMap[termId] = { _id: termId };
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
          regulationMap[id].cfr = part;
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

  yield models.Regulation.remove({});
  yield models.Regulation.create(_.values(regulationMap));

  isLoaded = true;
}

module.exports = loadRegulations;

