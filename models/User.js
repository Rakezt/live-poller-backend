const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['host', 'attendee'], required: true },
  pollId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
userSchema.index(
  { name: 1, role: 1, pollId: 1 },
  { unique: true, sparse: true }
);
module.exports = mongoose.model('User', userSchema);
