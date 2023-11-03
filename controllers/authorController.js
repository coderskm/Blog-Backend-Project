const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidBody = function (body) {
  return Object.keys(body).length > 0;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) != -1;
};

const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, message: "author details required" });
    }
    let { fname, lname, title, email, password } = data;
    if (!isValid(fname)) {
      return res.status(400).send({ status: false, message: "first name is required" });
    }
    if (!isValid(lname)) {
      return res.status(400).send({ status: false, message: "last name is required" });
    }
    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: "title is required" });
    }
    if (!isValid(email)) {
      return res.status(400).send({ status: false, message: "email is required" });
    }
    if (!isValid(password)) {
      return res.status(400).send({ status: false, message: "password is required" });
    }

    const emailInUse = await authorModel.findOne({ email: email });
    if (emailInUse) {
      return res.status(400).send({ status: false, message: "email entered is already in use" });
    }

    let savedData = await authorModel.create(data);
    res.status(201).send({ status: true, msg: savedData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const login = async function (req, res) {
  try {
    const data = req.body;
    if (!isValidBody(data)) {
      return res.status(400).send({ status: false, message: "Please provide email and password" });
    }
    let { email, password } = data;

    if (!isValid(email)) {
      return res.status(400).send({
        status: false,
        message: "email is required",
      });
    }
    if (!isValid(password)) {
      return res.status(400).send({ status: false, message: "password is required" });
    }

    const checkCredentials = await authorModel.findOne({
      email: email,
      password: password,
    });
    if (!checkCredentials) {
      return res.status(400).send({ status: false, message: "invalid login data" });
    }
    let token = jwt.sign({ authorId: checkCredentials._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    res.header("x-api-key", token);
    res.status(200).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.login = login;
