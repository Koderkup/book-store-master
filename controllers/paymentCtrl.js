const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");

const paymentCtrl = {
  // getPayments: async (req, res) => {
  //   try {
  //     const payments = await Payments.find();
  //     res.json(payments);
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },
  // getPayments: async (req, res) => {
  //   try {
  //     const { startDate, endDate, userName } = req.query;
  //     const query = {};

  //     if (startDate && endDate) {
  //       query.createdAt = {
  //         $gte: new Date(startDate),
  //         $lt: new Date(endDate),
  //       };
  //     }

  //     if (userName) {
  //       const user = await Users.findOne({ name: userName });
  //       if (user) {
  //         query.user_id = user._id;
  //       } else {
  //         res.status(400).json({ msg: "Пользователь не найден" });
  //       }
  //     }

  //     const payments = await Payments.find(query);
  //     res.json(payments);
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },
  // createPayment: async (req, res) => {
  //   try {
  //     const user = await Users.findById(req.user.id).select("name email");
  //     if (!user)
  //       return res.status(400).json({ msg: "Пользователь не существует" });

  //     const { cart, paymentID, address } = req.body;

  //     const { _id, name, email } = user;
  //     const newPayment = new Payments({
  //       user_id: _id,
  //       name,
  //       email,
  //       cart,
  //       paymentID,
  //       address,
  //     });

  //     cart.filter((item) => {
  //       return sold(item._id, item.quantity, item.sold);
  //     });

  //     await newPayment.save();
  //     res.json({ msg: "Платёж успешен!" });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  getPayments: async (req, res) => {
    try {
      const { startDate, endDate, userName } = req.query;
      const query = {};

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // добавляем один день к дате окончания поиска
        query.createdAt = {
          $gte: start,
          $lte: end,
        };
      }

      if (userName) {
        const user = await Users.findOne({ name: userName });
        if (user) {
          query.user_id = user._id;
        } else {
          return res.status(400).json({ msg: "Пользователь не найден" });
        }
      }

      const payments = await Payments.find(query);
      res.json(payments);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user)
        return res.status(400).json({ msg: "Пользователь не существует" });

      const { cart, paymentID, address } = req.body;

      const { _id, name, email } = user;
      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });

      await newPayment.save();

      for (let i = 0; i < cart.length; i++) {
        const { _id, quantity, sold } = cart[i];
        const product = await Products.findById(_id);
        if (!product) {
          return res
            .status(400)
            .json({ msg: `Товар с идентификатором ${_id} не найден` });
        }
        if (product.quantity < quantity) {
          return res.status(400).json({
            msg: `Количество товара ${product.name} недостаточно для выполнения платежа`,
          });
        }
        await Products.findByIdAndUpdate(_id, {
          quantity: product.quantity - quantity,
          sold: product.sold + quantity,
        });
      }

      res.json({ msg: "Платёж успешен!" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  
  getQrCodeString: async (req, res) => {
    const { sum } = req.params;

    const qrCodeString = `ST00012|Name=ИП Кузин П.В.|PersonalAcc=40702810138250123017|BankName=ОАО "МТБАНК"|BIC=044525225|CorrespAcc=3010181040000000022 5|PayeeINN=6200098765|LastName=Кузин|FirstName=Петр |MiddleName=Владимирович|Purpose=Оплата товара|PayerAddress=г.Витебск ул.В.Интернационалистов д.7|Sum=${sum}|Phone=375257729344|SomeNewReq=100`;

    res.json({ msg: qrCodeString });
  },

  deletePayments: async (req, res) => {
    try {
      // Получаем идентификаторы платежей, которые нужно удалить
      const { ids } = req.body;
      // Удаляем платежи
      await Payments.deleteMany({ _id: { $in: ids } });
      // Отправляем ответ с кодом 200
      res.status(200).json({ message: "Платежи успешно удалены" });
    } catch (err) {
      // Если произошла ошибка, отправляем ответ с кодом 500
      res.status(500).json({ message: err.message });
    }
  },
  updateStatus: async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    const result = await Payments.updateOne({ _id: paymentId }, { $set: { status: status }});
    if (result.nModified > 0) {
      res.json({ success: true });
    } else {
      res.json({ message: "Платеж не найден" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
},

};

module.exports = paymentCtrl;
