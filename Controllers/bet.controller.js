const Bet = require('../Models/bet')
const Order = require('../Models/order')
const User = require('../Models/user')

async function getActiveBet(req, res){
    let activebet = await Bet.findOne({status:'ACTIVE'})
    if(!activebet){ 
        res.status(204).json({message:'no bets active'})
    }
    res.status(200).json({_id:activebet._id, betId: activebet.betId,createdAt:activebet.createdAt})
}

async function returnActiveBet(){
    let activeBet = await Bet.findOne({status:"ACTIVE"})
    
    if(!activeBet){
        return false
    }

    return activeBet
}
async function addBet(){
    let newBet = Bet({

        Y:0,
        G:0,
        V:0
    })
    await newBet.save((err, newBet)=>{
        if(err){
            console.log(err, "error in saving bet")
        }else{
            console.log('created new bet', newBet.betId)
            return
        }
    })
    return true
}

async function updateActiveBetToDone(){
    
    let activebet = await Bet.findOneAndUpdate({status:'ACTIVE'},{status:"DONE"}, {new:true})
    // console.log({activebet})
    return activebet.betId
}

async function generateBetResult(){
    let activebet = await Bet.findOne({status:'ACTIVE'})

    let giveToG = activebet.G * process.env.GREEN
    let giveToY = activebet.Y * process.env.YELLOW
    let giveToV = activebet.V * process.env.VILOT
    if(!giveToV){ giveToY = 0}
    // console.log({giveToG, giveToV, giveToY})
    let updatedBet;


    if(giveToG<=giveToY){
        if(giveToG<giveToV){
            updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"G"},{new:true})
        }else{
            updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"V"},{new:true})
        }
    }else{
        if(giveToY<giveToV){
            updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"Y"},{new:true})
        }else{
            updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"V"},{new:true})
        }
    }

    // if(giveToG <= giveToY && giveToG <= giveToV){
    //     updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"G"},{new:true})
    //     //g wins
    // }else if(giveToY <= giveToG && giveToY <= giveToV){
    //     //Y wins
    //     updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"Y"},{new:true})
    // }else{
    //     //v wins
    //     updatedBet = await Bet.findOneAndUpdate({status:'ACTIVE'},{result:"V"},{new:true})
    // }
    return updatedBet

}

async function updateWinnerWallets(activebet){
    // console.log(activebet)
    let Multiplyer
    switch (activebet.result) {
        case 'G':
            Multiplyer = 'GREEN' 
            break;
        case 'Y':
            Multiplyer = 'YELLOW' 
            break;
        case 'V':
            Multiplyer = 'VILOT' 
            break;
        default:
            break;
    }
    
    for(let order of activebet.orders){
        let orderData = await Order.findOne({_id:order})
        // console.log({orderData,pp:process.env[Multiplyer] ,penv:process.env})
        if(orderData.choice == activebet.result){
            let user = await User.updateOne({_id:orderData.user_id}, {$inc:{wallet:orderData.amt * process.env[Multiplyer] }})
        }
    }
    return true

}


async function syncTimeOfLastBet(){
    await Bet.findOneAndUpdate({status:'ACTIVE'},{$set:{createdAt: new Date()}},{new:true})
    
}

module.exports = {addBet, updateActiveBetToDone, generateBetResult, updateWinnerWallets, getActiveBet, syncTimeOfLastBet, returnActiveBet}