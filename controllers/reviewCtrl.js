const Reviews = require("../models/reviewModel");

const reviewCtrl = {
  getReviews: async (req, res) => {
    try {
      const reviews = await Reviews.find().populate("product");
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getMyReviews: async (req, res) => {
    try {
      const reviews = await Reviews.find({ user: req.user.id }).populate(
        "product"
      );
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  addReview: async (req, res) => {
    try {
      const { author, text, rating, product } = req.body;
      const newReview = new Reviews({
        author,
        text,
        rating,
        product,
        user: req.body.user,
      });
      const savedReview = await newReview.save();
      res.json(savedReview);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  },
  editReview: async (req, res) => {
    try {
      const { text, rating } = req.body;
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Рейтинг должен быть от 1 до 5" });
      }
      const updatedReview = await Reviews.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { text, rating },
        { new: true }
      );
      if (!updatedReview) {
        return res.status(404).json({ msg: "Отзыв не найден" });
      }
      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteReview: async (req, res) => {
    try {
      const deletedReview = await Reviews.findByIdAndDelete(req.params.id);
      if (!deletedReview) {
        return res.status(404).json({ msg: "Отзыв не найден" });
      }
      res.json(deletedReview);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  banUser: async (req, res) => {
    try {
      const { reviewId, userId } = req.body;
      const updatedReview = await Reviews.findOneAndUpdate(
        { _id: reviewId },
        { isBanned: true, bannedUser: userId },
        { new: true }
      );
      if (!updatedReview) {
        return res.status(404).json({ msg: "Отзыв не найден" });
      }

      // Обновляем статус isUserBanned для всех отзывов, оставленных пользователем, который был заблокирован
      await Reviews.updateMany({ user: userId }, { isUserBanned: true });

      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  // Контроллер для разблокировки пользователя
  unbanUser: async (req, res) => {
    try {
      const { reviewId } = req.body;
      const updatedReview = await Reviews.findOneAndUpdate(
        { _id: reviewId },
        { isBanned: false, bannedUser: undefined },
        { new: true }
      );
      if (!updatedReview) {
        return res.status(404).json({ msg: "Отзыв не найден" });
      }

      // Обновляем статус isUserBanned для всех отзывов, оставленных пользователем, который был разблокирован
      await Reviews.updateMany(
        { user: updatedReview.bannedUser },
        { isUserBanned: false }
      );

      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = reviewCtrl;
