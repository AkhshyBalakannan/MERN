const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bankdetails', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    fullname: String,
    userid: String,
    email: String,
    password: String,
    panNumber: String,
    adhaarNumber: Number,
    branchName: String,
    bankbalance: {
        type: Number,
        default: 0,
    },
    transaction: [{
        currentAmount: Number,
        amount: Number,
        mode: String
    }]
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;



