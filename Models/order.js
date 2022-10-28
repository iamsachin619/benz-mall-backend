const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    

    user_id: {
        type: String,
        required: true,
    },
    betId:{
        type:Number,
        required:true
    },
    createdAt:{
        type: Date,
        default: mongoose.now
    },
    amt:{
        type:Number,
        required:true
    },
    choice:{
        type:String,
        enum:['Y','G','V']
    }
   
},
{ collection: 'orders' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
