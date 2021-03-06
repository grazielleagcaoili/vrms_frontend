const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
const logger = require('../logger')




//create user
router.route('/secretcreateuser').post(async (req, res) => {
    try{   
      var password = generator.generate({
        length: 10,
        numbers: true
    });
    const users = new User({
        name: req.body.name,
        email: req.body.email,
        project: req.body.project,
        title: req.body.title,
        password: password,
        category: req.body.category
    })
    const doesExist = await User.findOne({email: users.email})
    if (doesExist){
        res.status(400).json("Email already taken")
    }else{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL, //sender email
              pass: process.env.PASSWORD //sender password
            }
          });
          var mailOptions = {
            from: process.env.EMAIL,
            to: users.email,
            subject: 'VRMS ACCOUNT',
            text: 'You can login in Mariano Marcos State University Virtual Research Management System with your email using this password:' + users.password
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              logger.log('error', 'Error: email sending')
            } else {
              res.status(201).json({message: "Email was sent to the user!", user: newUser})
              console.log('Email sent: ' + info.response);
            }
          });
        const newUser =  await users.save()
        } 
    } catch(err){
      logger.log('error', `Error: /createUSer - ${err}`)
         res.status(400).json({message: err.message})
    }
 })


 //account update password
 router.post('/updatepassword', async(req, res) => {
     try {
        const user = await User.findOne({_id: req.body.id}) 
        if(req.body.newPass === null||req.body.oldPass === null){
            res.status(406).json({message: "Please Complete all details!"})
        }else{
            let valid = await bcrypt.compare(req.body.oldPass, user.password)
            if(valid)
            {
                let salt = await bcrypt.genSalt(10)
                let hashedPassword = await bcrypt.hash(req.body.newPass, salt)
            await User.updateOne({_id: user.id}, {password: hashedPassword}, (err) =>{
              if (err) {
               logger.log('error', 'update password')
              }
            })
              res.status(200).json({message: "Password Updated"})
            }else{
                res.status(406).json({message: "Invalid password"})
              
            }
        }
     } catch (error) {
      logger.log('error', `Error: /updatePassword - ${err}`)
        res.status(500).json({message: error.message})
     }
 })

//forgot password sending link to email
 router.post('/forgotpassword', async(req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})  
    if(!user){
        res.status(401).json({message: "Email not found"})
    }else{
      const payload={
        email: user.email,
        id: user._id
      }
      const token = await jwt.sign(payload, process.env.FORGOT_TOKEN_SECRET, {expiresIn: '360000'})
      const link = `http://localhost:3000/reset-password/?token=${token}` 

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,  //sender email
          pass: process.env.PASSWORD //sender password
        }
      });
      var mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'VRMS ACCOUNT',
        text: 'You can update your password with this link: ' + link
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          logger.log('error', `Error: /email sending forgot password - ${error}`)
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).json({payload, token})
    }
  } catch (error) {
    res.status(500).json({message: error.message})  
  }
})

//checking if token is valid
router.get('/reset-password/:token', async(req,res) => {
 const token = req.params
  try {
    jwt.verify(req.params.token, process.env.FORGOT_TOKEN_SECRET, async(err, user) =>{
      if(err){
        res.status(401).json({message: "Link already expired"})
      }else{
        res.status(200).json({user: user})
      }
    })
  } catch (error) {
    res.status(500).json({message: error.message}) 
  }
})

//reseting password using forgot password link
router.post('/reset-password/:token' , async(req, res) => {
  try {
    jwt.verify(req.params.token, process.env.FORGOT_TOKEN_SECRET, async(err, user) =>{
      if(err){
        logger.log('error', err)  
        res.status(401).json({message: "Link already expired"})
      }else{
        if(req.body.newPassword == req.body.confirmPassword){
          let salt = await bcrypt.genSalt(10)
          let hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
          await User.findOneAndUpdate({_id: user.id}, {password: hashedPassword}, (err) => {
            if(err){
              logger.log('error', `Error: /resetpassword - ${err}`)
              res.status(400).json({message: "Unable to update password"})
            }
          })
          res.status(200).json({message: "Password Updated"})
        }else{
          res.status(400).json({message: "Password does not match!"})
        }
      }
    })

  } catch (error) {
    logger.log('error', `Error: /reset password - ${error}`)  
    res.status(500).json({message: error.message})
  }
})

router.get("/getAllUser", async(req,res) => {
  try {
     User.find({"category": "user"}, {"name": 1, _id: 0}, function(err, users) {
      res.send(users);  
    });
  } catch (error) {
    logger.log('error', `Error: /getAllUser`)  
  }
})

router.get("/getAllManager", async(req,res) => {
  try {
     User.find({"category": "manager"}, {"name": 1, _id: 0}, function(err, users) {
      res.send(users);  
    });
  } catch (error) {
    logger.log('error', `Error: /getAllManager`)  
  }
})

module.exports = router