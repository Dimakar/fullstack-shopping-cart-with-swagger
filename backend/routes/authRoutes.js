const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

const generateToken = (data) => {
  return jwt.sign(data, process.env.PRIVATE_KEY);
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The auth managing API
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         username:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password
 *         email:
 *           type: string
 *           description: The user's email
 *         address:
 *           type: string
 *           description: The user's address
 *         phone:
 *           type: string
 *           description: The user's phone
 *         token:
 *           type: string
 *           description: The user's token
 *         order:
 *           type: array
 *           items:
 *              type: string
 *       example:
 *           address: "russia"
 *           email: "sdgrdsg@vas.ru"
 *           id: "61f2a53cc4ab0f0013c9ed2c"
 *           orders: []
 *           password: "$2b$10$v6VKDjuvznEODNF37zqPUOmRrRRM.W4CJ/JyWkIyKNviQ5YI2tfmG"
 *           phone: "8999999999"
 *           token: "eyJhbGciOiJIUzI1NiJ9.dmFzeWE.-q2q3ipjyOTT9UiZzfILKKZTDGaGBPBr9hGImF-wqD8"
 *           username: "vasya"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - address
 *         - phone
 *       properties:
 *         username:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password
 *         email:
 *           type: string
 *           description: The user's email
 *         address:
 *           type: string
 *           description: The user's address
 *         phone:
 *           type: string
 *           description: The user's phone
 *       example:
 *           address: "russia"
 *           email: "sdgrdsg@vas.ru"
 *           password: "vasya"
 *           phone: "8999999999"
 *           username: "vasya"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *           password: "vasya"
 *           username: "vasya"
 */



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreateResponse'
 *       409:
 *         description: User already exists
 *       500:
 *         description:
 */


router.post('/register', async ({ body }, res) => {
  const {
    username,
    password,
    email,
    address,
    phone,
  } = body;

  try {
    const user = await User.findOne({ username }).exec();

    if (user) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const newUserData = {
      username,
      email,
      address,
      phone,
      orders: []
    };

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    newUserData.password = hash;
    newUserData.token = generateToken(username);

    const newUser = new User(newUserData);
    const createdUser = await newUser.save();

    res.status(201).send({ ...createdUser.toJSON() });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreateResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description:
 */

router.post('/login', async ({ body }, res) => {
  const { username, password } = body;

  try {
    const existingUser = await User.findOne({ username }).exec();

    if (!existingUser) {
      return res.status(401).send({ message: 'No user found' });
    }

    const correctPassword = await bcrypt.compare(password, existingUser.password);

    if (!correctPassword) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    return res.status(200).send({ ...existingUser.toJSON() });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

module.exports = router;
