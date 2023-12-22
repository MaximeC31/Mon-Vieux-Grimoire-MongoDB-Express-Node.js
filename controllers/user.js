const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    if (req.body.password === '') {
      return res.status(400).json({ message: "password can't be blank" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    await user.save();
    res.status(201).json({ message: 'User added!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (validPassword) {
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
        });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logs = async (req, res, next) => {
  try {
    const email = await User.find();
    res.status(200).json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const account = await User.findOne({ email: req.body.email });

    if (account) {
      await User.deleteOne({ email: req.body.email });
      res.status(200).json({ message: 'Account deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
