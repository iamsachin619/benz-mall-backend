const User = require('../Models/user')
const jwt = require("jsonwebtoken");
var SHA256 = require("crypto-js/sha256");
async function Login(req,res){  
    
    let email = req.body.email
    let pass = req.body.pass
    if(!email || !pass){ res.status(400).json({message:'Bad Request'});return;}

    let user = await User.findOne({email: email})
    if(!user){ res.status(404).json({message:"User not found"});return;}
    
    if(SHA256(pass) != user.password){res.status(401).json({message:'Invalid Credentials'});return;}

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );
      res
      .status(200)
      .cookie("access_token", token,{sameSite: 'none', secure: true })
      .json({
        email: user.email,
        wallet: user.wallet
      })
    
}

async function Register(req, res){
    console.log(req.body)
    let email = req.body.email
    let pass = req.body.pass

    let existUser = await User.findOne({email: email})
    console.log({existUser})
    if(existUser){res.status(400).json({message:'Email already exists'});return;}

    let user = await User({
        email:email,
        password: SHA256(pass),
        wallet:500,
        contact:'',
        parsonalDetails:{}
    })
    user.save((err, userData)=>{
        if (err) {
            console.log(err)
            res.status(400).json({message:'Bad request!'})
        }else{
            const token = jwt.sign(
                { id: userData._id, email: userData.email },
                process.env.JWT_SECRET
              );
              res
                .status(200)
                .cookie("access_token", token,{sameSite: 'none', secure: true })
                .json({
                  email: userData.email,
                  wallet: userData.wallet
                })
        
        }
})

    console.log({user})

}

async function GetWalletUpdated(req, res){
  let user_id = req._id
  let user = await User.findOne({_id:user_id},{wallet:1})
  res.status(200).json(user._doc.wallet)
}

module.exports = {Login, Register, GetWalletUpdated}