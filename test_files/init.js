/**
 * Sample usage with custom configuration
 * All xml will be reloaded
 * Check jsdocs of `parser.init` for parameter description
 */

const path = require('path');
const parser = require('../');
const helper = require('./helper');

helper.run(function* run() {
  yield parser.init({
    mongodbUrl: 'mongodb://127.0.0.1:27017/lrs_parser',
    baseDir: path.resolve(__dirname, './xml'),
    naicsXmlFile: 'NAICS2012_LRSRelationships_RDF-SKOS_20160825.xml',
    programXmlFile: 'EPAProgramProject_LRSRelationships_RDF-SKOS_20160825.xml',
    regulationsFilePattern: 'CFR2015Title40*.xml',
  }, true);
});
