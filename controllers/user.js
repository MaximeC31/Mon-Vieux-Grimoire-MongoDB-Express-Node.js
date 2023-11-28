const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'login incorrect' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'password incorrect' });
    }

    res.status(200).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logs = async (req, res, next) => {
  try {
    const email = await User.find();
    return res.status(200).json({ message: email });
  } catch (error) {
    res.send(500).json({ error: error.message });
  }
};
