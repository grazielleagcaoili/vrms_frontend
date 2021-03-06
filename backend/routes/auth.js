const express = require('express')
const Token = require('../models/token')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');
const logger = require('../logger')

//LOGIN
router.post('/login', async (req, res) => {
    try{

        if (!req.body.email || !req.body.password) {
            res.status(401).json({message: "Please enter all required fields"})
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            res.status(401).json({message: "User not found"})
        }
            let valid = await bcrypt.compare(req.body.password, user.password);
                if(valid){
                    const refreshDuration = '3000000'
                    const accessToken = await generateAccessToken(user);
                    const refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: refreshDuration})

                const token = new Token({
                    id: user.id,
                    refreshToken: refreshToken,
                    refreshTokenDuration: refreshDuration,
                    isActive: true
                })
                const newToken = await token.save()
        
                res.status(200).json({data: user, token: token, accessToken})
                }else{
                    return res.status(401).json({ message: "Invalid password!" });
                }
    }catch(err){
        logger.log('error', `message: ${error}`)
        return res.status(500).json({ error: "Internal Server Error!" })
    }
})

//Verify authentication
router.get('/verify',auth, async (req, res) =>{
    try {
        res.status(200).json({status: true})
    } catch (error) {
        logger.log('error', `message: ${error}`)
        res.status(500).json(error)
    }
})

//Renewal of Access Token
router.post('/renewToken', async (req, res, next) =>{
    try {
        const refToken = req.body.refreshToken //refresh token from localstorage
        const refreshTokens = await Token.findOne({refreshToken: refToken}) //find refreshtoken if available in db
        const refreshToken = refreshTokens.refreshToken
        const user = await User.findOne({_id: refreshTokens.id})
        if (refToken == null){
            return res.status(401).json('Unauthorized/Missing token')
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, user) =>{
            if(err){
                Token.updateOne({refreshToken: refreshToken}, {isActive: false}, (err, res) =>{
                    if (err) {
                    logger.log('error', err)  
                    }else{
                    }
                })
            }else{
                const accessToken = generateAccessToken(user)
                res.status(200).json({accessToken, user})
            } 
            return res.status(401).json('Unauthorized')
        })
    } catch (error) {
        logger.log('error', error)
        next(error)
    }
    
})

//Logout
router.post('/logout', (req,res) =>{
    const refreshToken = req.body.refreshToken
    Token.updateOne({refreshToken: refreshToken}, {isActive: false}, (err, res) =>{
        if (err) {
            logger.log('error', err)  
        }
    })
})


//middleware

//for user authentication using access token
async function auth(req, res, next){
   try {
    let token = req.header('Authorization')
    token = token.split(" ")[1]
    
    if(token == null){
        return res.sendStatus(401).json({message: "Unauthorized, missing token"})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, payload) => {
      if(err){
        return res.sendStatus(401).json({err})
      }
      req.payload =payload
      next()
    })
   } catch(error) {
    logger.log('error', 'access token') 
    next(error)
   } 
}


//generating access token
function generateAccessToken(user){
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '300000'})
}

module.exports = router