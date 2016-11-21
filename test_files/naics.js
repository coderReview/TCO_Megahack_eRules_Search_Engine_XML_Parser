/**
 * Search naics codes with search criteria
 */

const parser = require('../');
const helper = require('./helper');

helper.run(function* run() {
  yield parser.init(null, false);

  console.log('Search for Grantmaking');
  helper.log(yield parser.searchNaicsCodes('Grantmaking', 0, 20));
  console.log('Search without keyword with limit 2');
  helper.log(yield parser.searchNaicsCodes(null, 0, 2));
  console.log('Get by code 812990');
  helper.log(yield parser.getNaicsByCode('812990'));
  console.log('Get by id 2944876');
  helper.log(yield parser.getNaicsById(2944876));
  console.log('Get by cfr 98, 432');
  helper.log(yield parser.getNaicsByCFR([98, 432]));
});
