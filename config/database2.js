const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepak988088:G869xbCJuZkfrtqh@cluster0.p56djlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const ContactModel = mongoose.model('feeds', userSchema);

module.exports = ContactModel;