/**
 * Configuration and init file for parser
 */

const _ = require('lodash');
const Joi = require('joi');
const config = require('../config');
const models = require('./models');
const helper = require('./helper');
const loadNaics = require('./load-naics');
const loadPrograms = require('./load-programs');

/**
 * Init and load parser
 * @param {Object} opts the options
 * @param {String} opts.mongodbUrl the url for mongodb
 * @param {String} opts.baseDir the base dir for xml files
 * @param {String} opts.naicsXmlFile the filename for NAICS codes xml
 * @param {String} opts.programXmlFile the file name for program xml
 * @param {String} opts.regulationsFilePattern the file pattern for all regulations xmls
 * @param {Boolean} load the flag if xml data should be loaded
 */
function* init(opts, load) {
  // update global config
  _.assignIn(config, opts || {});
  // init db models
  models(config.mongodbUrl);
  if (!load) {
    return;
  }
  yield loadNaics();
  yield loadPrograms();
}

/**
 * Search NAICS codes
 * @param {String} searchTerm the search criteria
 * @param {Number} offset the offset
 * @param {Number} limit the limit
 * @returns {{items: Array, total: Number}} the result
 */
function* searchNaicsCodes(searchTerm, offset, limit) {
  return yield helper.fullTextSearch(models.NaicsCode, searchTerm, offset, limit);
}

/**
 * Search program
 * @param {String} searchTerm the search criteria
 * @param {Number} offset the offset
 * @param {Number} limit the limit
 * @returns {{items: Array, total: Number}} the result
 */
function* searchPrograms(searchTerm, offset, limit) {
  return yield helper.fullTextSearch(models.Program, searchTerm, offset, limit, 'regulations');
}

/**
 * Get naics by code
 * @param {string} code the code
 * @returns {Object} the result
 */
function *getNaicsByCode(code) {
  Joi.assert(
    { code },
    { code: Joi.string().required() });
  return yield models.NaicsCode.findOne({ code });
}

/**
 * Get naics by id
 * @param {Number} id the id
 * @returns {Object} the result
 */
function *getNaicsById(id) {
  Joi.assert(
    { id },
    { id: Joi.number().integer().required() });
  return yield models.NaicsCode.findById(id);
}

/**
 * Get program by id
 * @param {Number} id the id
 * @returns {Object} the result
 */
function *getProgramById(id) {
  Joi.assert(
    { id },
    { id: Joi.number().integer().required() });
  return yield models.Program.findById(id);
}

/**
 * Get regulation by id or returns null if not found
 * @param {Number} id the id
 * @returns {Object} the result
 */
function* getRegulationById(id) {
  Joi.assert(
    { id },
    { id: Joi.number().integer().required() });
  return yield models.Regulation.findById(id);
}

module.exports = {
  init,
  searchNaicsCodes,
  getNaicsByCode,
  searchPrograms,
  getRegulationById,
  getNaicsById,
  getProgramById,
};
