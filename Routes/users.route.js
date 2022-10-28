const express = require('express')
const { placeOrder, getOrderHistory } = require('../Controllers/orders.controller')
const { Login, Register } = require('../Controllers/user.controller')

const route = express.Router()

route.post('/login',Login)
route.post('/register',Register)
route.post('/placeOrder', placeOrder)
route.post('/orderHistory', getOrderHistory)
route.get('/signOut', (req,res)=>{
    res.clearCookie('access_token')
    res.send('signed Out').status(200)
  })
  
module.exports = route