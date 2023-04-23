const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/payment")
  .get(auth, authAdmin, paymentCtrl.getPayments)
  .post(auth, paymentCtrl.createPayment);

router.route("/payment/qrcode/:sum").get(auth, paymentCtrl.getQrCodeString);

module.exports = router;
