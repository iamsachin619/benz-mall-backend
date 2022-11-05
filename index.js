const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const cron = require("node-cron");
const app = express()
const autoIncrement = require('mongoose-auto-increment');
const userRoutes = require('./Routes/users.route');

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json())
const whitelist = ['https://game-bingo-1b719.web.app','http://localhost:3000']
app.use(cors({origin:function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  } ,credentials: true}))

const { addBet, updateActiveBetToDone, updateWinnerWallets, syncTimeOfLastBet } = require('./Controllers/bet.controller');
const { betMaker } = require('./CronFunction/cron');

app.use('/user',userRoutes)


// Creating a cron job which runs on every 2 minutes
cron.schedule('*/2 * * * *', function() {
    console.log("running a task every 2 mins");
    betMaker()
});

// app.get('/',(req, res) =>{
//     betMaker()
// })
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
app.listen(process.env.PORT,()=>{
    connect()
    // syncTimeOfLastBet()
    console.log('server running at 3008')
})