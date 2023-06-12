const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/products")
  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: получение всех товаров
   *     description: возвращает список всех товаров
   *     responses:
   *       200:
   *         description: список всех товаров
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  .get(productCtrl.getProducts)

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: создание нового товара
   *     description: создание нового товара
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: product
   *         in: body
   *         description: Product object
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: A product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   */
  .post(auth, authAdmin, productCtrl.createProduct); 

router
  .route("/products/:id")
  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: удаление товара по ID
   *     description: удаление товара по ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: удаление товара по ID
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success message
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  .delete(auth, authAdmin, productCtrl.deleteProduct)
  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: редактирование товара по ID
   *     description: редактирование товара по ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: редактирование товара по ID
   *         required: true
   *         schema:
   *           type: string
   *       - name: product
   *         in: body
   *         description: Product object to update
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: A product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   */
  .put(auth, authAdmin, productCtrl.updateProduct);

module.exports = router;
