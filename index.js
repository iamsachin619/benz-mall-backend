const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require("node-cron");
const app = express()
const autoIncrement = require('mongoose-auto-increment');
const userRoutes = require('./Routes/users.route');
app.use(express.json());


const { addBet, updateActiveBetToDone } = require('./Controllers/bet.controller');
const { betMaker } = require('./CronFunction/cron');

app.use('/user',userRoutes)


// Creating a cron job which runs on every 2 minutes
cron.schedule('*/2 * * * *', function() {
    console.log("running a task every 2 mins");
    betMaker()
});

//mongo db connect
const connect =  async () => {
    try {
        
        let connection = await mongoose.connect(process.env.MONGO,{autoIndex:true});
        autoIncrement.initialize(connection);
        console.log('Connected to MongoDB');
    }catch(err) {
        console.log(err);
    }
}
app.listen(3008,()=>{
    connect()
    console.log('server running at 3008')
})