const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('MongoDB connected');
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
  }
}

module.exports = new Database();