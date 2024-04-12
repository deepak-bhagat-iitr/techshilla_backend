// Import necessary modules
const express = require('express');
const app = express();
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const UserModel = require('./config/database1');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const ContactModel = require('./config/database2');
const MedicineModel = require('./config/database3');
require('./config/passport')

// Middleware setup

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'https://techshilla-frontend.onrender.com/', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT'], // Allow these HTTP methods
    credentials: true
}));

app.use(passport.initialize());

// Route for registering a new user
app.post('/register', (req, res) => {
    const user = new UserModel({
        name: req.body.name,
        telephone: req.body.telephone,
        email: req.body.email,
        password: hashSync(req.body.password, 10)
    })

    user.save().then(user => {
        res.send({
            success: true,
            message: "User created successfully.",
            user: {
                id: user._id,
                email: user.email
            }
        })
    }).catch(err => {
        res.send({
            success: false,
            message: "Something went wrong",
            error: err
        })
    })
})

// Route for retrieving all registered users
app.get('/users', (req, res) => {
    UserModel.find().then(users => {
        res.send(
            users
        );
    }).catch(err => {
        res.send({
            success: false,
            message: "Failed to retrieve registered users.",
            error: err
        });
    });
});

// Route for user login
app.post('/login', (req, res) => {
    UserModel.findOne({ email: req.body.email }).then(user => {
        // No user found
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Could not find the user."
            })
        }

        // Incorrect password
        if (!compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                success: false,
                message: "Incorrect password"
            })
        }

        const payload = {
            email: user.email,
            id: user._id
        }

        const token = jwt.sign(payload, "Random string", { expiresIn: "1d" })

        return res.status(200).send({
            success: true,
            message: "Logged in successfully!",
            token: "Bearer " + token
        })
    })
})
app.post('/user/contact', (req, res) => {
    ContactModel.insertMany([req.body]).then(user => {

        return res.status(200).send({
            success: true,
            message: "Send feedback!!"
        })
    })
})
app.post('/medicines/:name', (req, res) => {
    MedicineModel.insertMany([req.body]).then(user => {

        return res.status(200).send({
            success: true,
            message: "order successfully!!"
        })
    })
})
app.get('/medicines/:name', (req, res) => {
    MedicineModel.find().then(users => {
        res.send(
            users
        );
    }).catch(err => {
        res.send({
            success: false,
            message: "Failed to retrieve order.",
            error: err
        });
    });
})
app.delete('/medicines/:name', (req, res) => {
    MedicineModel.deleteOne(req.params.name).then(users => {
        res.send(
            users
        );
    }).catch(err => {
        res.send({
            success: false,
            message: "Failed to delete order.",
            error: err
        });
    });
})

app.put('/user/:name', (req, res) => {
    const name = req.params.name;
    const newData = req.body;

    // Assuming you have a UserModel with a method like findOneAndUpdate to update user data
    UserModel.findOneAndUpdate({ name: name }, newData)
        .then(user => {
            if (user) {
                res.status(200).send({
                    success: true,
                    message: "User data updated successfully.",
                    user: user
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: "User not found."
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                success: false,
                message: "Internal server error.",
                error: error
            });
        });
});


// Route for retrieving user info (requires authentication)
app.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
        }
    })
})

// Route for user logout
app.get('/logout', (req, res) => {
    res.send({
        success: true,
        message: "Logged out successfully."
    });
});

// Start the server
app.listen(5000, () => console.log("Listening to port 5000"));
