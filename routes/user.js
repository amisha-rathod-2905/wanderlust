const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user.js");

router.route("/signup")
.get((req, res) => {res.render("./users/signup");})
.post(wrapAsync(userController.signupNewUser));

router.route("/login")
.get(userController.loginFormRender)
.post(saveRedirectUrl,
    passport.authenticate('local',{ failureRedirect: '/login',failureFlash: true }),
    userController.loginExistingUser);

//logout route
router.get("/logout",userController.logoutExistingUser);

module.exports = router;