const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const User = require('./models/User');

    // Delete all users
    await User.deleteMany({});

    // Create fresh user via Model (lowercase email apply hoga)
    const hash = await bcrypt.hash('123456', 10);
    await User.create({
        name: 'Ali',
        email: 'ali123@gmail.com',
        phone: '03111111111',
        passwordHash: hash
    });

    // Test find
    const found = await User.findOne({ email: 'ali123@gmail.com' });
    console.log('User found:', found ? 'YES' : 'NO');
    console.log('Email in DB:', found?.email);

    process.exit();
});