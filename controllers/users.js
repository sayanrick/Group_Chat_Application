const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

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

    // Create the user with the hashed password
    await User.create({ name, email, phone, password: hashedPassword });
    
    res.status(201).json({ message: 'Successfully created a new user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error signing up' });
  }
};
