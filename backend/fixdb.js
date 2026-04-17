const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
    await mongoose.connection.collection('vehicles').dropIndexes();
    console.log('Indexes dropped!');
    process.exit();
});