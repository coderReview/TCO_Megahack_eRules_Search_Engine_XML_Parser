/**
 * Configuration and init file for parser
 */

const _ = require('lodash');
const Joi = require('joi');
const config = require('../config');
const models = require('./models');
const helper = require('./helper');
const loadRegulations = require('./load-regulations');
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
  yield loadRegulations();
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
  return yield helper.fullTextSearch(models.NaicsCode, searchTerm, offset, limit, 'regulations');
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
 * Get naics by cfr parts
 * @param {Number} cfrParts the cfr parts
 * @returns {Object} the result
 */
function *getNaicsByCFR(cfrParts) {
  Joi.assert(
    { cfrParts },
    { cfrParts: Joi.array().items(Joi.number().required()) });
  let results = yield models.NaicsCode.find().populate({
      path: 'regulations',
      match: { cfr: { $in: cfrParts } }
  }).exec();

  return _.filter(results, naics => naics.regulations.length > 0);
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
 * Get program by cfr part
 * @param {Number} cfrPart the cfr part
 * @returns {Object} the result
 */
function *getProgramByCFR(cfrParts) {
  Joi.assert(
    { cfrParts },
    { cfrParts: Joi.array().items(Joi.number().required()) });
  let results = yield models.Program.find().populate({
      path: 'regulations',
      match: { cfr: { $in: cfrParts } }
  }).exec();
  return _.filter(results, programs => programs.regulations.length > 0);
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

/**
 * Get regulation by CFR parts or returns null if not found
 * @param {Number} cfrParts the cfr parts
 * @returns {Object} the result
 */
function* getRegulationByCFR(cfrParts) {
  Joi.assert(
    { cfrParts },
    { cfrParts: Joi.array().items(Joi.number().required()) });
  return yield models.Regulation.find({ cfr: { $in: cfrParts } });
}


module.exports = {
  init,
  searchNaicsCodes,
  getNaicsByCode,
  searchPrograms,
  getRegulationById,
  getRegulationByCFR,
  getNaicsById,
  getNaicsByCFR,
  getProgramById,
  getProgramByCFR
};
