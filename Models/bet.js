const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const betSchema = new mongoose.Schema({
    

   
    createdAt:{
        type: Date,
        default: mongoose.now
    },
    status:{
        type:String,
        enum : ['ACTIVE','DONE'],
        default:'ACTIVE'
    },
    Y:{
        type:Number
    },
    G:{
        type:Number
    },
    V:{
        type:Number
    },
    result:{
        type:String,
        enum:['Y','G','V',null]
    },
    orders:[{
        type: String
    }]
},
{ collection: 'bets' });
autoIncrement.initialize(mongoose.connection);
betSchema.plugin(autoIncrement.plugin, { model: 'Bet', field: 'betId',startAt:1,incrementBy:1 });
const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;
