const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, 'secretkey');
}

exports.generateAccessToken = generateAccessToken;

function isStringValid(str) {
  return str !== undefined && str.length > 0;
}

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!isStringValid(name) || !isStringValid(email) || !isStringValid(password)) {
      return res.status(400).json({ error: 'Bad Parameters: Something is missing' });
    }

    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists, please log in' });
    }

    // Create the user with the hashed password
    await User.create({ name, email, phone, password: hashedPassword });

    // Send a success response to the client
    res.status(201).json({ message: 'Successfully created a new user' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error signing up' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isStringValid(email) || !isStringValid(password)) {
      return res.status(400).json({ message: "Email Id or Password is missing", success: false });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const token = generateAccessToken(user.id, user.name);
      return res.status(200).json({ success: true, message: 'User logged in successfully', token });
    } else {
      return res.status(401).json({ success: false, message: 'Password is incorrect' });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
