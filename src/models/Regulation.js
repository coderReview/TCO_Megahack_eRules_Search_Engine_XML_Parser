/**
 * Schema for Program
 */

const Schema = require('mongoose').Schema;


module.exports = new Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String },
  cfr: { type: Number, required: false },
  // parts >=50 AND <=98
  isCAA: { type: Boolean, default: false },
});
