const Reviews = require("../models/reviewModel");

const checkUserBanned = async (req, res, next) => {
  const userId = req.user.id; // Получаем ID текущего пользователя из токена аутентификации
  try {
    const isUserBanned = await Reviews.findOne({
      user: userId,
      isUserBanned: true,
    }); // Проверяем, заблокирован ли пользователь
    if (isUserBanned) {
      return res.status(403).json({ message: "Ваши комментарии заблокированы администратором. Вопросы по адресу kupet1978@mail.ru" }); // Если пользователь заблокирован, возвращаем ошибку 403
    } else {
      next(); // Если пользователь не заблокирован, переходим к следующему middleware или обработчику маршрута
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." }); // Если возникла ошибка при проверке, возвращаем ошибку 500
  }
};

module.exports = checkUserBanned;
