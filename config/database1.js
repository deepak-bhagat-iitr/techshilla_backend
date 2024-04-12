const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepak988088:G869xbCJuZkfrtqh@cluster0.p56djlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    telephone: String,
    password: String
});

const UserModel = mongoose.model('techs', userSchema);

module.exports = UserModel;