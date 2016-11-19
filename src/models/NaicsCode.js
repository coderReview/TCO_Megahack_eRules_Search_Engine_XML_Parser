/**
 * Schema for NaicsCode
 */

const Schema = require('mongoose').Schema;


module.exports = new Schema({
  _id: { type: Number, required: true },
  label: { type: String, required: true, index: 'text' },
  code: { type: String },
});
