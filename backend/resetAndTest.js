const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('vehicles').deleteMany({});
    await mongoose.connection.collection('wallets').deleteMany({});

    const hash = await bcrypt.hash('123456', 10);
    await mongoose.connection.collection('users').insertOne({
        name: 'Ali',
        email: 'ali123@gmail.com',
        phone: '03111111111',
        passwordHash: hash,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    console.log('User created successfully!');
    process.exit();
});