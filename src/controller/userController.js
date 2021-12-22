const userModel = require("../model/userModel")
const validate = require("../validator/validate")
const aws = require('../aws');


const createUser = async function (req, res) {

    try {
        const requestBody = req.body;
        const { fname, lname, profileImage, phone, email, password } = requestBody
        console.log("hlo",req.body)
        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
            return
        }

        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: 'fname is required' })
            return
        }

        if (!validate.isValid(lname)) {
            res.status(400).send({ status: false, message: `lname is required` })
            return
        }
        
        if (!validate.isValid(phone)) {
            res.status(400).send({ status: false, message: `phone no. is required` })
            return
        }

        if (!validate.validatePhone(phone)) {
            res.status(400).send({ status: false, message: `phone should be a valid number` });
            return;
        }
        const isPhoneNumberAlreadyUsed = await userModel.findOne({ phone: phone });
        if (isPhoneNumberAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone} mobile number is already registered`, });
            return;
        }
        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!validate.validateEmail(email)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property 
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        if (!validate.isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        if (!validate.validatePassword(password)) {
            res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
            return
        }
         
        // if (!validate.isValid(address.shipping.street)) {
        //     res.status(400).send({ status: false, message: `street is required` })
        //     return
        // }
        // if (!validate.isValid(address.shipping.city)) {
        //     res.status(400).send({ status: false, message: `city is required` })
        //     return
        // }
        // if (!(typeof address.shipping.pincode == "number")) {
        //     res.status(400).send({ status: false, message: `pincode is required` })
        //     return
        // }
        // if (!validate.isValid(address.billing.street)) {
        //     res.status(400).send({ status: false, message: `street is required` })
        //     return
        // }
        // if (!validate.isValid(address.billing.city)) {
        //     res.status(400).send({ status: false, message: `city is required` })
        //     return
        // }
        // if (!(typeof address.billing.pincode == "number")) {
        //     res.status(400).send({ status: false, message: `pincode is required` })
        //     return
        // }
        let files = req.files;
        if (files && files.length > 0) {
          //upload to s3 and return true..incase of error in uploading this will go to catch block( as rejected promise)
          let uploadedFileURL = await aws.uploadFile( files[0] ); 
        if(uploadedFileURL){
            requestBody.profileImage = uploadedFileURL
        }
        const userData = await userModel.create(requestBody)
        res.status(201).send({ status: true, msg: "successfully created", data: userData })
    }
    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }

}
module.exports.createUser = createUser