const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wallet:{
        type: Number,
        required: true
    },
   
    contact: {
        type: Number,
        required: false
    },
    personalDetails: {
        type: Object
    },
    
    
    // betOrders: [{
    //     type: Object
    // }]   
},
{ collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User;
