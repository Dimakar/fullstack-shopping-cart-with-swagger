const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: The catalog API
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     CatalogResponse:
 *       type: object
 *       properties:
 *         info:
 *           type: object
 *           properties:
 *             batery:
 *               type: string
 *             camera:
 *               type: string
 *             color:
 *               type: string
 *             cpu:
 *               type: string
 *             dimensions:
 *               type: string
 *             displayResolution:
 *               type: string
 *             displaySize:
 *               type: string
 *             displayType:
 *               type: string
 *             internalMemory:
 *               type: string
 *             name:
 *               type: string
 *             os:
 *               type: string
 *             photo:
 *               type: string
 *             price:
 *               type: integer
 *             ram:
 *               type: string
 *             weight:
 *               type: string
 *           example:
 *             name: "Apple iPhone 8 Plus"
 *             dimensions: "158.4 x 78.1 x 7.5 mm"
 *             weight: "202 g"
 *             displayType: "LED-backlit IPS LCD, capacitive touchscreen, 16M colors"
 *             displaySize: "5.5"
 *             displayResolution: "1080 x 1920 pixels"
 *             os: "iOS 11"
 *             cpu: "Hexa-core (2x Monsoon + 4x Mistral)"
 *             internalMemory: "256 GB"
 *             ram: "3 GB"
 *             camera: "Dual: 12 MP (f/1.8, 28mm, OIS) + 12 MP (f/2.8, 57mm)"
 *             batery: "Non-removable Li-Ion 2691 mAh battery (10.28 Wh)"
 *             color: "White"
 *             price: 700
 *             photo: "/img/apple_iphone_8_plus.jpg"
 *         tags:
 *           type: object
 *           description: kk
 *           properties:
 *             brand:
 *               type: string
 *             camera:
 *               type: string
 *             color:
 *               type: string
 *             cpu:
 *               type: string
 *             displayResolution:
 *               type: string
 *             displaySize:
 *               type: string
 *             internalMemory:
 *               type: string
 *             os:
 *               type: string
 *             priceRange:
 *               type: string
 *             ram:
 *               type: string
 *           example:
 *             priceRange: "500-750"
 *             brand: "apple"
 *             color: "white"
 *             os: "ios"
 *             internalMemory: "256"
 *             ram: "3"
 *             displaySize: "5.5"
 *             displayResolution: "1080x1920"
 *             camera: "12"
 *             cpu: "hexa_core"
 *         _id:
 *           type: string
 *           example: "61b35d36dccbe752b78a2a8d"
 */


/**
 * @swagger
 * /api/catalog:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get phones' catalog
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatalogResponse'
 */


router.get('/', (req, res) => {
    Product.find({})
        .then((foundProduct) => {
            res.send(foundProduct);
        });
});

module.exports = router;