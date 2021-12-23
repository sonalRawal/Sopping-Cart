const aws = require("aws-sdk");
const bcrypt = require('bcrypt');

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" 
});


// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) { 
    
    // Create S3 service object
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });
    var uploadParams = {
      ACL: "public-read", // this file is publically readable
      Bucket: "classroom-training-bucket",
      Key: "group6/projectsManagement/" +new Date()+file.originalname,    
      Body: file.buffer, 
    };

    // Callback - function provided as the second parameter ( most oftenly)
    s3.upload(uploadParams , function (err, data) {
      if (err) {
        return reject( { "error": err });
      }
      
      //console.log(`File uploaded successfully. ${data.Location}`);
      return resolve(data.Location); 
    });
  });
}
const hashPassword = async (password, saltRounds = 2) => {
        // Hash password
        return await bcrypt.hash(password, saltRounds);  
    }

module.exports = {uploadFile,hashPassword} ;

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
        