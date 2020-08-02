import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: String,
});

export default model('User', userSchema);