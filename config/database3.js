const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepak988088:G869xbCJuZkfrtqh@cluster0.p56djlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test');
const userSchema = mongoose.Schema({
    name: String,
    image:String
    
});

const MedicineModel = mongoose.model('medicines', userSchema);

module.exports = MedicineModel;