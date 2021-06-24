const mongoose = require('mongoose');
const UserProfile = require('./Schemas/userprofile');
mongoose.connect('mongodb://localhost:27017/bankdetails', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const user = new UserProfile({
    firstname: 'akhshy',
    email: 'akhshyganeshb@gmail.com',
    userid: 'akhshyganesh',
    panNumber: 'CUGP564489',
    adhaarNumber: 546465564,
})
user.save();