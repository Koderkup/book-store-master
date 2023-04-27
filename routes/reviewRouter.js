const router = require("express").Router();
const reviewCtrl = require("../controllers/reviewCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const Reviews = require("../models/reviewModel");

// Получение всех отзывов, Добавление нового отзыва
router
  .route("/reviews")
  .get(reviewCtrl.getReviews)
  .post(auth, reviewCtrl.addReview); //auth,

// Получение всех отзывов для зарегистрированных пользователей
router.route("/my-reviews").get(auth, reviewCtrl.getMyReviews); //auth,

//Редактирование отзыва пользователем
router.route("/my-reviews/:id").put(auth, reviewCtrl.editReview); //auth,

// Удаление отзыва админом
router.route("/reviews/:id").delete(authAdmin, reviewCtrl.deleteReview); //authAdmin,

// Банн юзера
router.route("/ban-user").post(authAdmin, reviewCtrl.banUser);

module.exports = router;
