const express = require('express');
const _ = require('lodash');
const User = require('../models/User');
const { checkToken } = require('../middleware/checkToken');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
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
 *              type: object
 *              properties:
 *
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
 *     Message:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The answer text
 *       example:
 *           message: "User updated"
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Register a new user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.get('/', checkToken, (req, res) => {
  res.status(200).send(req.user);
});

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Register a new user
 *     tags: [User]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully updated
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */

router.put('/', checkToken, async ({ body, user }, res) => {
  const {
    email,
    address,
    phone,
  } = body;

  try {
    const foundUser = await User.findById(user.id).exec();

    await foundUser.replaceOne({
      ..._.omit(foundUser.toJSON(), ['id']),
      email: email || foundUser.email,
      address: address || foundUser.address,
      phone: phone || foundUser.phone,
    });

    return res.status(200).send({ message: 'User updated' });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

module.exports = router;