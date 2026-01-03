const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const users = await User.find({});
    console.log('Users found:', users.length);
    users.forEach(u => {
      console.log(`- ${u.email} (Admin: ${u.isAdmin})`);
    });
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
