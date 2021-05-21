const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const keys = require("../../config/keys");
const passport = require("passport");


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public

router.get("/",verifyToken,(req, res) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      User.findOne({
        name: authData.name
       }).then(user => res.json(user))
    }
  });
});

router.delete("/",verifyToken,(req, res) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      User.deleteOne({
        name: authData.name
       }).then(user => res.json("ok"))
    }
  });
});

router.put("/",verifyToken,(req, res) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    console.log(authData)
    if(err) {
      res.sendStatus(403);
    } else {
      User.updateOne({_id: authData.id}, { name: req.body.name, email: req.body.email, address: req.body.address}).then(user => res.json("ok"))
    }
  });
});

router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      console.log(req.body.address);
      console.log("sdfsgdsasdfghj");
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address

        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 300 // s min in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}


module.exports = router;
