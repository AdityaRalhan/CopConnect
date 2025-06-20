import mongoose from 'mongoose';

const lawSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
});

const Law = mongoose.model('laws', lawSchema);

export default Law;
