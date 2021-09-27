const mongoose = require('mongoose');
const User = require('../models/user');
const faker = require('faker');
const bcrypt = require('bcrypt');

const dbUrl = 'mongodb://localhost:27017/rp-users-api';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // set to db so its shorter to write
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})

const seedDB = async () => {
    await User.deleteMany({}); 
    
    for (let i = 0; i < 30; i++) { 
        const newUser = new User({
            author: '6116631106371f5ad4bba995', // development
            username: faker.internet.userName(), 
            password: bcrypt.hashSync('faker.internet.password()', 10),
            email: faker.internet.email()
        })
        await newUser.save();
        console.log(newUser);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});