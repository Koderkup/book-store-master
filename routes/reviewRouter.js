const router = require("express").Router();
const Reviews = require("../models/reviewModel");
const reviewCtrl = require("../controllers/reviewCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const checkUserBanned = require("../middleware/checkUserBanned");



// Получение всех отзывов, Добавление нового отзыва
/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: получение всех отзывов
 *     description: получение всех отзывов
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Добавление нового отзыва
 *     description: Добавление нового отзыва
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: review
 *         in: body
 *         description: Review object
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: A review object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router
  .route("/reviews")
  .get(reviewCtrl.getReviews)
  .post(auth, checkUserBanned, reviewCtrl.addReview); //auth,

// Получение всех отзывов для зарегистрированных пользователей
/**
 * @swagger
 * /api/my-reviews:
 *   get:
 *     summary: Получение всех отзывов для зарегистрированных пользователей
 *     description: Получение всех отзывов для зарегистрированных пользователей
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.route("/my-reviews").get(auth, reviewCtrl.getMyReviews); //auth,

//Редактирование отзыва пользователем
/**
 * @swagger
 * /api/my-reviews/{id}:
 *   put:
 *     summary: Редактирование отзыва пользователем по ID
 *     description: Редактирование отзыва пользователем по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Редактирование отзыва пользователем по ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: review
 *         in: body
 *         description: Редактирование отзыва пользователем по ID
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: A review object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.route("/my-reviews/:id").put(auth, reviewCtrl.editReview); //auth,

// Удаление отзыва админом
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Удаление отзыва админом по ID
 *     description: Удаление отзыва админом по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Удаление отзыва админом по ID
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
router.route("/reviews/:id").delete(auth, authAdmin, reviewCtrl.deleteReview); //authAdmin,

// Банн юзера
/**
 * @swagger
 * /api/reviews/ban-user:
 *   post:
 *     summary: Банн пользователя - запрет на оставление отзывов
 *     description: Банн пользователя - запрет на оставление отзывов
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: body
 *         description: Банн пользователя - запрет на оставление отзывов
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
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
//router.post("/reviews/ban-user", auth, authAdmin, reviewCtrl.banUser);

router.route("/reviews/ban-user").post(auth, authAdmin, reviewCtrl.banUser);
// Разбан юзера

/**
 * @swagger
 * /api/reviews/unban-user:
 *   post:
 *     summary: Снятие запрета на оставление отзывов для пользователя 
 *     description: Снятие запрета на оставление отзывов для пользователя
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: body
 *         description: Снятие запрета на оставление отзывов для пользователя
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
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
router.route("/reviews/unban-user").post(auth, authAdmin, reviewCtrl.unbanUser);

module.exports = router;
