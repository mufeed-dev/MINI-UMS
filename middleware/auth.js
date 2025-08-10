const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return next();
    }
    return res.redirect("/login");
  } catch (error) {
    console.error("isLogin error:", error);
    return res.status(500).send("Server error");
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home");
    }
    return next();
  } catch (error) {
    console.error("isLogout error:", error);
    return res.status(500).send("Server error");
  }
};

module.exports = { isLogin, isLogout };
