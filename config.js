const path = require('path');

module.exports = {
  mongodbUrl: 'mongodb://127.0.0.1:27017/lrs_parser',
  baseDir: path.resolve(__dirname, './test_files/xml'),
  naicsXmlFile: 'NAICS2012_LRSRelationships_RDF-SKOS_20160825.xml',
  programXmlFile: 'EPAProgramProject_LRSRelationships_RDF-SKOS_20160825.xml',
  regulationsFilePattern: 'CFR2015Title40*.xml',
};
