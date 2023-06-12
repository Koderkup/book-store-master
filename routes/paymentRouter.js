const router = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/payment")
  /**
   * @swagger
   * /api/payment:
   *   get:
   *     summary: получение всей истории покупок
   *     description: получение всей истории покупок
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: получение всей истории покупок
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Payment'
   */
  .get(auth, authAdmin, paymentCtrl.getPayments)
  /**
   * @swagger
   * /api/payment:
   *   post:
   *     summary: создание заказа
   *     description: создание заказа
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: payment
   *         in: body
   *         description: Payment object
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/Payment'
   *     responses:
   *       201:
   *         description: A payment object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Payment'
   */
  .post(auth, paymentCtrl.createPayment)
  /**
   * @swagger
   * /api/payment:
   *   delete:
   *     summary: удалить все заказы
   *     description: удалить все заказы
   *     security:
   *       - bearerAuth: []
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
  .delete(auth, authAdmin, paymentCtrl.deletePayments);
  /**
 * @swagger
 * /api/payment/qrcode/{sum}:
 *   get:
 *     summary: получение Get строки  QR code для платежа
 *     description: получение Get строки  QR code для платежа
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sum
 *         in: path
 *         description: Payment amount
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: QR code string
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.route("/payment/qrcode/:sum").get(auth, paymentCtrl.getQrCodeString);
/**
 * @swagger
 * /api/payment/update-status:
 *   post:
 *     summary: обновление статуса заказа
 *     description: обновление статуса заказа
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: payment
 *         in: body
 *         description: Payment object
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: A payment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router
  .route("/payment/update-status")
  .post(auth, authAdmin, paymentCtrl.updateStatus);
module.exports = router;
