let express     = require("express"),
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
});

//SHOW LOGIN FORM
router.get("/login", (req, res) => {
    res.render("login");
});

// HANDLE LOGIN FORM
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to MyDiary!'
    }), function(req, res){
});

// router.post("/login", (req, res) => {
//     User.findById(req.user, (err, user) => {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("/login");
//         } else {
//             passport.authenticate("local")(req, res, function(){
//                 req.flash("success", "Logged in as " + req.user.username);
//                 res.redirect("/" + req.user._id + "/notes");
//             });
//         }
//     })
// });

    
// LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged you out");
    res.redirect("/");
});

module.exports = router;