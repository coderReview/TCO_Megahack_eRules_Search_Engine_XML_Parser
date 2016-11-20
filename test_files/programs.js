/**
 * Search programs with search criteria
 */

const parser = require('../');
const helper = require('./helper');

helper.run(function* run() {
  yield parser.init(null, false);

  console.log('Search for Brownfields');
  helper.log(yield parser.searchPrograms('Brownfields', 0, 20));
  console.log('Search without keyword with limit 2');
  helper.log(yield parser.searchPrograms(null, 0, 2));
  console.log('Get by id 3796305');
  helper.log(yield parser.getProgramById(3796305));
  console.log('Get by cfr 372');
  helper.log(yield parser.getProgramByCFR([372]));
});
