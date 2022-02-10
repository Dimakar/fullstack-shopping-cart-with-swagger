const express = require('express');
const User = require('../models/User');
const { checkToken } = require('../middleware/checkToken');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The Order API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderRequest:
 *       type: object
 *       properties:
 *         order:
 *           type: array
 *           items:
 *             dateCreated:
 *               type: integer
 *             name:
 *               type: string
 *             price:
 *               type: integer
 *             quantity:
 *               type: integer
 *           example:
 *             dateCreated: 1643796608156
 *             name: "Apple iPhone 8 Plus"
 *             price: 700
 *             quantity: 2
 */


/**
 * @swagger
 * /api/order:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Buy the product
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       200:
 *         description: The phone was successfully bought
 */
router.post('/', checkToken, (req, res) => {
  User.findById(req.user.id)
    .then((foundUser) => {
      foundUser.orders = foundUser.orders.concat(req.body.order);
      foundUser.save(() => res.end());
    });
});

module.exports = router;
