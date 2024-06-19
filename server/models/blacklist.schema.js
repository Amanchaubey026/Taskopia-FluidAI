import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '4h', // Token expires after 4 hours
  },
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist; 
