import { Schema, model } from 'mongoose';

const houseSchema = new Schema({
  thumbnail: String,
  url: String,
  description: String,
  price: Number,
  location: String,
  status: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  toJSON: {
    virtuals: true,
  }
});

export default model('House', houseSchema);
