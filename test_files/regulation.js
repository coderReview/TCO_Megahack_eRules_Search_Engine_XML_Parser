/**
 * get regulation by id
 */

const parser = require('../');
const helper = require('./helper');

helper.run(function* run() {
  yield parser.init(null, false);

  console.log('Get regulation by id 3884932');
  helper.log(yield parser.getRegulationById(3884932));
});
