const isLogin = async (req, res, next) => {
  try {
    if (req.session.admin_id) {
      return next();
    }
    return res.redirect("/admin");
  } catch (error) {
    console.error("isLogin error:", error);
    return res.status(500).send("Server error");
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.admin_id) {
      return res.redirect("/admin/home");
    }
    return next();
  } catch (error) {
    console.error("isLogout error:", error);
    return res.status(500).send("Server error");
  }
};

module.exports = { isLogin, isLogout };
