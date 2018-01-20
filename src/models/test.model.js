// test mongoose object that a database might use for a User document
import { Schema, model } from 'mongoose';

const MzTestDoc = new Schema({
  _id: { type: Number },
  username: { type: String },
  password: { type: String }
});

const testModel = new model('MzTestDoc', MzTestDoc, 'MzTestDoc');
module.exports = testModel;
