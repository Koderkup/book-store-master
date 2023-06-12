const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/category")
  /**
   * @swagger
   * /api/category:
   *   get:
   *     summary: получаем объект со всеми категориями
   *     description: возвращает список всех категорий товаров
   *     responses:
   *       200:
   *         description: список всех категорий товаров
   */
  .get(categoryCtrl.getCategories)
  /**
   * @swagger
   * /api/category:
   *   post:
   *     summary: создаем новую категорию
   *     description: создаем новую категорию
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: category
   *         in: body
   *         description: Category object
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Category'
   *     responses:
   *       201:
   *         description: A category object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   */
  .post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route("/category/:id")
  /**
   * @swagger
   * /api/category/{id}:
   *   delete:
   *     summary: удаляем категорию по ID
   *     description: удаляем категорию по ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID категории для удаления
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
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  /**
   * @swagger
   * /api/category/{id}:
   *   put:
   *     summary: редактируем категорию по  ID
   *     description: редактируем категорию по  ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID редактируемой категории
   *         required: true
   *         schema:
   *           type: string
   *       - name: category
   *         in: body
   *         description: Category object to update
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Category'
   *     responses:
   *       200:
   *         description: A category object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   */
  .put(auth, authAdmin, categoryCtrl.updateCategory);

module.exports = router;
