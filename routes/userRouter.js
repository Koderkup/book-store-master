const router = require("express").Router();
 const userCtrl = require("../controllers/userCtrl");
 const auth = require("../middleware/auth");

 /**
 * @swagger
 * /api/register:
 *   post:
 *     summary: регистрация нового пользователя
 *     description: регистрация нового пользователя
 *     parameters:
 *       - name: user
 *         in: body
 *         description: User object
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

 

 router.post("/register", userCtrl.register);
 /**
 * @swagger
 * /api/login:
 *   post:
 *     summary: авторизация существующего пользователя
 *     description: авторизация существующего пользователя
 *     parameters:
 *       - name: user
 *         in: body
 *         description: User object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: A user object with access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */

 router.post("/login", userCtrl.login);
 /**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: выход существующего пользователя
 *     description: выход существующего пользователя
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

 router.get("/logout", userCtrl.logout);

 
/**
 * @swagger
 * /api/refresh_token:
 *   get:
 *     summary: обновление токена
 *     description: обновление токена доступа используя обновленный токен
 *     security:
 *       - bearerRefresh: []
 *     responses:
 *       200:
 *         description: новый токен доступа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */

 router.get("/refresh_token", userCtrl.refreshToken);
 /**
 * @swagger
 * /api/infor:
 *   get:
 *     summary: получение текущей информации о пользователе
 *     description: получение текущей информации о пользователе
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

 router.get("/infor", auth, userCtrl.getUser);
/**
 * @swagger
 * /api/addcart:
 *   patch:
 *     summary: добавление товара в корзину пользователя
 *     description: добавление товара в корзину пользователя
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: body
 *         description: ID of the product to add to cart
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productId:
 *               type: string
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
 router.patch("/addcart", auth, userCtrl.addCart);
/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: получение истории покупок пользователя
 *     description: получение истории покупок пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
 router.get("/history", auth, userCtrl.history);

module.exports = router;
