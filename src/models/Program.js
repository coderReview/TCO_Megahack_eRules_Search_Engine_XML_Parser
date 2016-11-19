/**
 * Schema for Program
 */

const Schema = require('mongoose').Schema;

module.exports = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true, index: 'text' },
  regulations: { type: [{ type: Number, ref: 'Regulation' }] },
});
