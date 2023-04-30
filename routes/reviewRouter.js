const router = require("express").Router();
const Reviews = require("../models/reviewModel");
const reviewCtrl = require("../controllers/reviewCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const checkUserBanned = require("../middleware/checkUserBanned");



// Получение всех отзывов, Добавление нового отзыва
router
  .route("/reviews")
  .get(reviewCtrl.getReviews)
  .post(auth, checkUserBanned, reviewCtrl.addReview); //auth,

// Получение всех отзывов для зарегистрированных пользователей
router.route("/my-reviews").get(auth, reviewCtrl.getMyReviews); //auth,

//Редактирование отзыва пользователем
router.route("/my-reviews/:id").put(auth, reviewCtrl.editReview); //auth,

// Удаление отзыва админом
router.route("/reviews/:id").delete(auth, authAdmin, reviewCtrl.deleteReview); //authAdmin,

// Банн юзера
router.route("/reviews/ban-user").post(auth, authAdmin, reviewCtrl.banUser);
// Разбан юзера
router.route("/reviews/unban-user").post(auth, authAdmin, reviewCtrl.unbanUser);

module.exports = router;
