/* eslint global-require: 0 */
/**
 * Init and export all schemas.
 */

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let conn;

/**
 * Initialize model
 * @param {Object} schema the schema
 * @param {String} name the model name
 */
function createModel(schema, name) {
  const model = conn.model(name, schema);

  model.schema.options.minimize = false;
  model.schema.options.toJSON = {
    /**
     * Transform model to json object
     * @param {Object} doc the mongoose document which is being converted
     * @param {Object} ret the plain object representation which has been converted
     * @returns {Object} the transformed object
     */
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  };
  module.exports[name] = model;
}

/**
 * Init db models
 * @param {String} url the mogodb url
 */
function init(url) {
  conn = mongoose.connect(url).connection;

  createModel(require('./NaicsCode'), 'NaicsCode');
  createModel(require('./Program'), 'Program');
  createModel(require('./Regulation'), 'Regulation');
}

module.exports = init;
