/* eslint no-console: 0, no-process-exit: 0 */
/**
 * Helper file for running script
 */

const co = require('co');

/**
 * Run function
 * @param {Function} fn the function to run
 */
function run(fn) {
  co(fn)
    .then(() => process.exit())
    .catch((e) => {
      console.log(e.stack);
      throw e;
    });
}

/**
 * Stringify object to console
 * @param {Object} obj the object to log
 */
function log(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = {
  run,
  log,
};

