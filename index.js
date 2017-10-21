var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user")
    
//APP CONFIG
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/doodle_DB", {useMongoClient: true});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "big big secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.User;
    next();
})
 
//========================================================================    
//RESTFUL ROUTES
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/dashboard", isLoggedIn, function(req, res){
    res.render("dashboard");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

//handle sign up logic
app.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/")
        });
    });
});

app.get("/login", function(req, res){
    res.render("/");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/dashboard",
        failureRedirect: "/"
    }), function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}





app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Doodle App has started!");
});