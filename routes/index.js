var express = require('express');
var otpGenerator = require('otp-generator');
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'prodigi-interactive';

var router = express.Router();

const customers = require("../model/customer");
const promocode = require("../model/promocode");

let generateCode = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: true,
    upperCase: false,
    specialChars: false,
  });
};

let encryptPassword = (pswd) => {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(pswd, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

// Genarate Promo Code
router.post('/genpromocode', function (req, res, next) {
  let response = generateCode();
  // console.log(response);

  let dataObj = [{ promocode: response }];

  promocode.insertMany(dataObj, function (err, result) {
    if (result) {
      res.json('Promocode Successfully Created');
    } else {
      res.json('Promocode Create Failed');
    }
  });
});

// Fetch All Promo Codes
router.get('/fetchallpromocodes', function (req, res, next) {
  promocode.find({}, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// Create User
router.post('/signup', function (req, res, next) {
  let body = req.body;

  let pswd = encryptPassword(body.password);

  let userObj = {
    username: body.username,
    password: pswd,
    points: 0
  }

  customers.create(userObj, function (err, result) {
    console.log(result)
    if (result) {
      res.json('User Successfully Created');
    } else {
      res.json('Failed To Create User');
    }
  });
});

// Create User with Promo Code
router.post('/signupwithpromo', function (req, res, next) {
  let body = req.body;
  let pswd = encryptPassword(body.password);

  promocode.find({ promocode: body.promocode }, function (err, promoCodeResult) {
    if (promoCodeResult === undefined || promoCodeResult.length == 0) {
      res.json('Invalid Promo Code');
    } else {

      let userObj = {
        username: body.username,
        password: pswd,
        points: 10,
      }

      customers.create(userObj, function (err, customerResult) {
        if (customerResult) {
          res.json('User Successfully Created');
        } else {
          res.json('Failed To Create User');
        }
      });
    }
  });
});

module.exports = router;
