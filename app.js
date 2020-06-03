let express             = require("express"),
    expressSanitizer 	= require("express-sanitizer"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    User                = require("./models/user");

let noteRoutes      = require("./routes/notes"),
    userRoutes      = require("./routes/user"),
    indexRoutes     = require("./routes/index");

// mongoose.connect("mongodb://localhost/MyDiary");
mongoose.connect("mongodb+srv://northwillov:Ya150699@cluster0-daqdu.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Ann love roses",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/:user_id", userRoutes);
app.use("/:user_id/notes", noteRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting Server...");
});







