const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const config = require("../config/config");

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
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For Verification mail",
      html:
        `<p>hi ${name}, please click here <a href="http://127.0.0.1:3000/verify?id=` +
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

// reset-mail
const sendResetMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html:
        `<p>hi ${name}, please click here <a href="http://127.0.0.1:3000/forget-password?token=` +
        token +
        `"> Reset</a> your password.</p>`,
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

const verifyMail = async (req, res) => {
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

// login user methods
const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === 0) {
          res.render("login", { message: "Please verify your email" });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Email and Password is incorrect" });
      }
    } else {
      res.render("login", { message: "Email and Password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

// forget password load
const forgetLoad = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.is_verified === 0) {
        res.render("forget", { message: "Please verify your email" });
      } else {
        const randomString = randomstring.generate();
        const updatedData = await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        sendResetMail(userData.name, userData.email, randomString);
        res.render("forget", {
          message: "Please check your mail to reset your password",
        });
      }
    } else {
      res.render("forget", { message: "User email is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPassLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("forget-password", { user_id: tokenData._id });
    } else {
      res.render("404", { message: "Token is Invalid" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const securePass = await securePassword(password);
    const updatedData = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: securePass, token: "" } }
    );
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

// verification send mail
const verificationLoad = async (req, res) => {
  try {
    res.render("verification");
  } catch (error) {
    console.log(error.message);
  }
};
const sendVerificationLink = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.is_verified === 1) {
        res.render("verification", {
          message: "already verified!",
        });
      } else {
        sendVerifyMail(userData.name, userData.email, userData._id);
        res.render("verification", {
          message: "Please check your mail and verify",
        });
      }
    } else {
      res.render("verification", { message: "E-Mail not exist " });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  verifyMail,
  loginLoad,
  verifyLogin,
  loadHome,
  forgetLoad,
  forgetVerify,
  forgetPassLoad,
  resetPassword,
  verificationLoad,
  sendVerificationLink,
};
