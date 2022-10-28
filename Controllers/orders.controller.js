const { json } = require("body-parser")
const Bet = require("../Models/bet")
const Order = require("../Models/order")
const User = require("../Models/user")

async function placeOrder(req, res){
    let user_id = req.body._id
    let betId = req.body.betId
    let amt = req.body.amt
    let choice = req.body.choice
    let user = await User.findById(user_id)
    // console.log({user})
    let bet = await Bet.findOne({betId})
    
    if(!bet){res.status(403).json({message:'Bet yet to come'});return;}
    if(bet.status != "ACTIVE"){res.status(400).json({message:"Bet not active"});return;}
    if(user.wallet < amt){res.status(400).json({message:"Not enough balance"});return;}
    let order = Order({
        user_id,
        betId,
        amt,
        choice
    })
    order.save(async(err, orderData)=>{
        if(err){
            console.log(err,'error in placing order')
            res.status(400).json({message:"Error while placing order"})
            return
        }else{

            await User.updateOne(
                {_id:user_id},
                {wallet: user.wallet - amt,
                $push:{betOrders: {amt: orderData.amt,orderId:orderData._id}}}
                )
            await Bet.updateOne({betId},{$inc:{[`${choice}`]:amt}, $push:{orders:orderData._id}})
            res.status(200).json({message:'Order placed successfully'})
            return
        }
    })

    
}

async function getOrderHistory(req, res){
    let user_id = req.body._id
    let orderHistory = await Order.aggregate([
        {
            $match:{user_id:user_id}
        },
        {
            $lookup: {
                from: "bets",
                localField: "betId",
                foreignField: "betId",
                as: "bet"
                }
        },
        {
            $project:{
            
                "betId": 1,
                "amt": 1,
                "choice": 1,
                "createdAt":1,
                "result":"$bet.result"
            }
        }

    ])
    console.log(orderHistory)
    res.status(200).json({orderHistory})
}

module.exports = {
    placeOrder,
    getOrderHistory
}