const express = require('express')
const { getActiveBet } = require('../Controllers/bet.controller')
const { placeOrder, getOrderHistory } = require('../Controllers/orders.controller')
const { Login, Register, GetWalletUpdated } = require('../Controllers/user.controller')
const { verifyToken } = require('../Util/verify')

const route = express.Router()

route.post('/login',Login)
route.post('/register',Register)
route.post('/placeOrder',verifyToken, placeOrder)
route.get('/orderHistory',verifyToken, getOrderHistory)
route.get('/getUpdatedWallet',verifyToken, GetWalletUpdated)
route.get('/signOut', (req,res)=>{
    res.clearCookie('access_token')
    res.send('signed Out').status(200)
  })
route.get('/activeBet',getActiveBet)
  
module.exports = route