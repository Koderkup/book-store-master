require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");


const app = express();
require("./swagger")(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
//email transporter
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "kupet1978@mail.ru",
    pass: "J0Hhkim3MAR9x8bWNRXr",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/paymentRouter"));
app.use("/api", require("./routes/reviewRouter"));

//Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Подключен к MongoDB");
  }
);

app.get("/", (req, res) => {
  res.json({ msg: "добро пожаловать на мой сервер" });
});
//отправка email
app.post("/email", (req, res) => {
  const mailOptions = {
    from: "kupet1978@mail.ru",
    to: "itlearn.ku@gmail.com",
    subject: req.body.pay_number,
    text: `${req.body.message}, ${req.body.email}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Сервер запущен на порту ", PORT);
});
