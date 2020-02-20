var express 	= require("express"),
    router 		= express.Router(),
    User        = require("../models/user"),
    middleware  = require("../middleware");

router.get("/", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user, (err, user) => {
        if (err) {
            req.flash("error", "User not found");
            res.redirect("back");
        } else {
            res.render("user/user", {user: user});
        }
    });
});

module.exports = router;