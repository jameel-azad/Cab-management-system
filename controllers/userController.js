const passport = require('passport');
const User = require('../models/user_data');
const Cab = require('../models/cabTimings');
const Booking = require('../models/booking');
const bcrypt = require('bcrypt')

const user_index = async (req,res) => {
    const cabs = await Cab.find()
    res.render('index', { user: req.user, cabs:cabs });
}

const user_login = (req,res) => {
    res.render('log-in');
}

const user_authenticate = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureFlash: true
})

const user_signup = (req,res) => {
    res.render('sign-up');
}

const user_create = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mob_num: req.body.mob_num,
            hall: req.body.hall,
            isAdmin: false,
            password: hashedPassword
        });
        const result = await user.save();
        res.redirect("/user/log-in");
    } catch (err) {
        res.redirect('/user/sign-up')
        return next(err);
    };
}

const user_logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/")
    });
}

const user_profile = async (req,res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    const bookings = await Booking.find({email: user.email});
    if(user){
        res.render('profile',{name: user.name, email: user.email, mob_num: user.mob_num, hall: user.hall, bookings: bookings});
    }
    else{
        res.status(404).render('404');
    }
}

module.exports= {
    user_index,
    user_login,
    user_authenticate,
    user_signup,
    user_create,
    user_logout,
    user_profile
}