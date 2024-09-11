const user = require("../models/user.js");

module.exports.signupNewUser = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        let newUser = new user({email, username});
        let registeredUser = await user.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust :)");
            res.redirect("/listing");
        });
    }
    catch(error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}

module.exports.loginFormRender =  (req ,res) => {
    res.render("users/login.ejs");
}

module.exports.loginExistingUser = async(req, res) => {
    req.flash("success", "welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logoutExistingUser =  (req, res, next) => {
    req.logOut((err) => {
        if(err) {
          return  next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listing");
    });
}