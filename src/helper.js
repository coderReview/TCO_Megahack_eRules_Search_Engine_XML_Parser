/**
 * Helper functions
 */

const path = require('path');
const fs = require('mz/fs');
const _ = require('lodash');
const Joi = require('joi');
const glob = require('glob');
const parseString = require('xml2js').parseString;
const config = require('../config');

let regulations;

/**
 * Parse SKOS xml file
 * @param {String} xmlPath the absolute path
 * @returns {{concepts: Object, descriptions: Object}} the json content
 */
function* parseSkosXML(xmlPath) {
  const content = yield fs.readFile(xmlPath, 'utf8');
  const json = yield (cb) => parseString(content, cb);

  const concepts = _.get(json, 'rdf:RDF.skos:Concept');
  const descriptions = _.get(json, 'rdf:RDF.rdf:Description');
  if (!_.isArray(concepts)) {
    throw new Error('rdf:RDF -> skos:Concept must be an array');
  }
  if (!_.isArray(descriptions)) {
    throw new Error('rdf:RDF -> rdf:Description must be an array');
  }

  return { concepts, descriptions };
}

/**
 * Parse and validate skos item with prefLabel
 * @param {Object} item the item
 * @returns {{label: String, termId: Number}}
 */
function parsePrefLabel(item) {
  const label = _.get(item, 'skos:prefLabel[0]');
  let termId = _.get(item, 'zthes:termID[0]');
  if (!label && !termId) {
    throw new Error(`skos:prefLabel and zthes:termID must be defined in item: ${JSON.stringify(item)}`);
  }
  termId = Number(termId);
  if (!_.isNumber(termId)) {
    throw new Error(`termId must be a number in item: ${JSON.stringify(item)}`);
  }
  return { label, termId };
}

/**
 * Load XML for regulations
 * @returns {Array} the array of parsed xml files
 */
function* loadRegulations() {
  if (!regulations) {
    const pattern = path.join(config.baseDir, config.regulationsFilePattern);
    const files = yield (cb) => glob(pattern, cb);
    regulations = yield _.map(files, parseSkosXML);
  }
  return regulations;
}

/**
 * Search using full text index
 * @param {Object} model the mongoose model
 * @param {String} searchTerm the search term
 * @param {Number} offset the offset
 * @param {Number} limit the limit
 * @param {String} populate the fields to populate
 * @returns {{items: Array, total: Number}} the result
 */
function* fullTextSearch(model, searchTerm, offset, limit, populate) {
  Joi.assert(
    { searchTerm, limit, offset },
    {
      searchTerm: Joi.string().allow(null, ''),
      limit: Joi.number().integer().min(1),
      offset: Joi.number().integer().min(0),
    });

  let itemsQuery;
  let totalQuery;

  if (searchTerm) {
    itemsQuery = model
      .find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } });
    totalQuery = model.count({ $text: { $search: searchTerm } });
  } else {
    itemsQuery = model.find();
    totalQuery = model.count();
  }
  if (populate) {
    itemsQuery.populate(populate);
  }

  if (offset) {
    itemsQuery.skip(offset);
  }
  if (limit) {
    itemsQuery.limit(limit);
  }
  const [items, total] = yield [itemsQuery, totalQuery];
  return { items, total };
}

module.exports = {
  parseSkosXML,
  parsePrefLabel,
  loadRegulations,
  fullTextSearch,
};
