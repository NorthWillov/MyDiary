const express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

// AUTH ROUTES


//SHOW REGISTER ROUTE
router.get("/register", (req, res) => {
    res.render("register");
}); 

//HANDLE SIGN UP LOGIC
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    if (req.body.password.length >= 8) { 
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/" + req.user._id + "/notes");
                });
            }
        });
    } else {
        req.flash("error", "Password must contain at least 8 characters");
        res.redirect("back");
    }
});

//SHOW LOGIN FORM
router.get("/login", (req, res) => {
    res.render("login");
});

// HANDLE LOGIN FORM
// router.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/",
//         failureRedirect: "/login",
//         failureFlash: true,
//         successFlash: 'Welcome to MyDiary!'
//     }), function(req, res){

// });
router.post('/login', 
    passport.authenticate('local', 
    { 
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Welcome to MyDiary!'
    }),
    function(req, res) {
        res.redirect(`/${req.user._id}/notes`);
  });

    
// LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged you out");
    res.redirect("/");
});

module.exports = router;