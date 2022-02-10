const express = require('express');
const bodyParser = require('body-parser');
const Cart = require('../models/Cart');
const { checkToken } = require('../middleware/checkToken');

const router = express.Router();
const jsonParser = bodyParser.json();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart API
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     ProductInCart:
 *       type: object
 *       properties:
 *         product:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CatalogResponse'
 *         quantity:
 *           type: integer
 *           example: 1
 *         _id:
 *           type: string
 *           example: "62052147da7cd9001a3ee017"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     GetCartResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInCart'
 *         __v:
 *           type: integer
 *           example: 1
 *         user:
 *           type: string
 *           example: "61b3677584790d001212a841"
 *         _id:
 *           type: string
 *           example: "62052147da7cd9001a3ee016"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddToCartRequest:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Product id
 *         quantity:
 *           type: integer
 *           description: The quantity of phones
 *         user:
 *           type: string
 *           description: The user's password
 *       example:
 *           product: "61b35d36dccbe752b78a2a8d"
 *           quantity: 1
 *           user: "61b3677584790d001212a841"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteFromCartRequest:
 *       type: object
 *       properties:
 *         cartId:
 *           type: string
 *         itemId:
 *           type: string
 *       example:
 *         cartId: "62052147da7cd9001a3ee016"
 *         itemId: "62052173da7cd9001a3ee018"
 */


/**
 * @swagger
 * /api/cart:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add phone to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       201:
 *         description: The phone was successfully added
 */

router.post('/', checkToken, (req, res) => {
  const user = req.user;
  const item = {
    product: req.body.product,
    quantity: req.body.quantity
  };

  Cart.findOne({ user: user })
    .then((foundCart) => {
      if (foundCart) {
        let products = foundCart.items.map((item) => item.product + '');
        if (products.includes(item.product)) {
          Cart.findOneAndUpdate({
            user: user,
            items: {
              $elemMatch: { product: item.product }
            }
          },
            {
              $inc: { 'items.$.quantity': item.quantity }
            })
            .exec()
            .then(() => res.end());
        } else {
          foundCart.items.push(item);
          foundCart.save().then(() => res.end());
        }
      } else {
        Cart.create({
          user: user,
          items: [item]
        })
          .then(() => res.end());
      }
    });
});

/**
 * @swagger
 * /api/cart:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: get phones in the cart
 *     tags: [Cart]
 *     responses:
 *      200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetCartResponse'
 */

router.get('/', checkToken, (req, res) => {
  Cart.findOne({ user: req.user.id })
  .populate('items.product')
  .exec((err, cart) => {
    if (!cart) {
      return res.send(null);
    }

    res.send(cart);
  });
});

/**
 * @swagger
 * /api/cart:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: delete phone from the cart
 *     tags: [Cart]
 *     responses:
 *      200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetCartResponse'
 */

/**
 * @swagger
 * /api/cart:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     summary: delete phone from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteFromCartRequest'
 *     responses:
 *       201:
 *         description: The phone was successfully deleted from the cart
 */

router.put('/', checkToken, jsonParser, (req, res) => {
  Cart.findById(req.body.cartId)
    .then((foundCart) => {
      foundCart.items = foundCart.items.filter((item) => item._id != req.body.itemId);
      foundCart.save(() => res.end());
    });
});

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *        - in: query
 *          name: id
 *          required: true
 *          schema:
 *             type: integer
 *     responses:
 *       200:
 *         description: The cart is empty
 */
router.delete('/', checkToken, (req, res) => {
  Cart.findByIdAndRemove(req.query.id)
    .then(() => res.end())
    .catch((err) => res.send(err));
});

module.exports = router;