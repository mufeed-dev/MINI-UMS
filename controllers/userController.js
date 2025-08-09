const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error.message);
  }
};

// send mail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "mufeed.temp@gmail.com",
        pass: "vbsp euhn hxqg jgge",
      },
    });
    const mailOptions = {
      from: "mufeed.temp@gmail.com",
      to: email,
      subject: "For Verification mail",
      html:
        `<p>hi ${name}, please click here <a href="http:127.0.0.1:3000/verify?id=` +
        user_id +
        `"> Verify</a> your mail.</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log("Email has been sent", info.response);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const sPassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      image: req.file.filename,
      password: sPassword,
      is_admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.render("registration", {
        message:
          "Your registration has been successfull, Please Verify your mail",
      });
    } else {
      res.render("registration", {
        message: "Your registration has been failed.",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verfiyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );
    console.log(updateInfo);
    res.render("email-verified");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  verfiyMail,
};
