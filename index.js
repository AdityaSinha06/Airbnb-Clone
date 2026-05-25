if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const port = 8080;
const Listing = require("./models/listing.js")
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate"); //allows to use templating: layouts , includes
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { register } = require("module");
const multer = require("multer");
const upload = multer({dest: 'uploads/'});

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    }, 
    touchAfter: 24*3600, //interval bw session updates
});

store.on("error" , (err) => {
    console.log("ERROR in MONGO SESSION STORE" , err);
})

const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1week in millisecs
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //to prevent from cross-scripting attacks
    },//Date.now() :: in milliseconds returns the date of curr
};

app.use(session(sessionOptions));
app.use(flash());

//passport will be configured after the session initialization, coz' we 'd want the user to remain same for a session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to serialize users into the session :: pack down to just ids, instead of storing the the entire users info into the session memory to avoid crashes
passport.deserializeUser(User.deserializeUser()); // to deserialize the user :: unpack the id back into a full user object

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log("Heya, its check flash" , res.locals.success);
    // console.log('heyaa, its error flash check' , res.locals.error);
    next();
})

async function main() {
    await mongoose.connect(MONGO_URL, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
    });
}

main()
    .then((res) => {
        console.log("Connection to db successful");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        console.error(err);
    })


app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.use((req , res , next) => {
    next(new ExpressError(404 , "Page not Found!"));
});

app.use((err , req , res , next) => {
    let {statusCode , message} = err;
    res.render("error.ejs" , {message});
    // res.status(statusCode).send(message);
});

app.listen(port , (req , res) => {
    console.log(`Server is listening at port: ${port}`);
});

// http cookies are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser