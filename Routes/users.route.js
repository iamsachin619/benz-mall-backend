const express = require('express')
const { placeOrder } = require('../Controllers/orders.controller')
const { Login, Register } = require('../Controllers/user.controller')

const route = express.Router()

route.post('/login',Login)
route.post('/register',Register)
route.post('/placeOrder', placeOrder)
module.exports = route