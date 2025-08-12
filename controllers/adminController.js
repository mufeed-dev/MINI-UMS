const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const config = require("../config/config");
const nodemailer = require("nodemailer");

const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error.message);
  }
};

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
        `<p>hi ${name}, please click here <a href="http://127.0.0.1:3000/admin/forget-password?token=` +
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

const addUserMail = async (name, email, password, admin_id) => {
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
      subject: "Verify Your Mail",
      html:
        `<p>hi ${name}, please click here <a href="http://127.0.0.1:3000/verify?id=` +
        admin_id +
        `"> Verify</a> your mail.</p><br><br> <b>Email:-</b>${email}<br> <b>Pasword:-</b>${password}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log("Email has been sent", info.response);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_admin === 0) {
          res.render("login", { message: "Email or password is incorrect" });
        } else {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.render("login", { message: "Email or password is incorrect" });
      }
    } else {
      res.render("login", { message: "Email or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const adminData = await User.findOne({ _id: req.session.admin_id });
    res.render("home", { admin: adminData });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    delete req.session.admin_id;
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};
const forgetLoad = async (req, res) => {
  try {
    delete req.session.admin_id;
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const adminData = await User.findOne({ email: email });

    if (adminData) {
      if (adminData.is_admin === 0) {
        res.render("forget", { message: "Email is Incorrect" });
      } else {
        const randomString = randomstring.generate();
        const updatedData = await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        sendResetMail(adminData.name, adminData.email, randomString);

        res.render("forget", {
          message: "Please check mail for reset password",
        });
      }
    } else {
      res.render("forget", { message: "Email is Incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const adminData = await User.findOne({ token: token });
    if (adminData) {
      res.render("forgetPassword", { admin_id: adminData._id });
    } else {
      res.render("404", { message: "Invalid Link" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { password, admin_id } = req.body;
    const securePass = await securePassword(password);
    const updatedData = await User.findByIdAndUpdate(
      { _id: admin_id },
      { $set: { password: securePass, token: "" } }
    );
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const adminDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 });
    res.render("dashboard", { users: usersData });
  } catch (error) {
    console.log(error.message);
  }
};

// add new user
const newUser = async (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const image = req.file.filename;
    const password = randomstring.generate(8);
    const sPassword = await securePassword(password);

    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      image: image,
      password: sPassword,
      is_admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      addUserMail(name, email, password, userData._id);
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "failed to add user" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// edit user
const editUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { users: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          is_verified: req.body.verify,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// delete User
const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  forgetLoad,
  forgetVerify,
  forgetPasswordLoad,
  forgetPassword,
  adminDashboard,
  newUser,
  addUser,
  editUser,
  updateUser,
  deleteUser,
};
