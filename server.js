//npm init
// npm i express body-parser mongoose

const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//connect to mongodb server
mongoose.connect('mongodb://localhost:27017/carsDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

const date = new Date(); // getting the current date to use later

// Note that I set the stock number as a string
const carSchema = {
    stock_num: {
        type: String,
        validate: {
            validator: function (value) {
                return value.length >= 5;
            },
            message: "stock number must be at least 5 characters long"
        }
    },
    make: {
        type: String,
        required: [true, "make cannot be empty"]
    },
    model: {
        type: String,
        required: [true, "model cannot be empty"]
    },
    year: {
        type: Number,
        min: [1900, "year cannot be less than 1900"],
        max: [date.getFullYear(), "year cannot be greater than current year"]
    },
    color: {
        type: String,
        required: [true, "color cannot be empty"]
    },
    url: {
        type: String,
        required: [true, "url cannot be empty"]
    },
    price: {
        type: Number,
        min: [0, "price cannot be less than $0"]
    },
    avail: {
        type: String,
        required: [true, "availability cannot be empty"]
    }
}


const Car = mongoose.model('Car', carSchema);


app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/edit", function (req, res) {
    res.sendFile(__dirname + "/public/edit.html");
});

// changes the availability of a car to be what it currently is not (used by detail page)
app.post("/changeAvail", function (req, res) {
    let newAvail = "available";

    //this code changes the availability to sold if it was available and to available if not already available
    // console.log("availability of " + req.body._id + " was " + req.body.avail);
    if (req.body.av === newAvail) {
        newAvail = "sold";
    }
    console.log("availability of " + req.body._id + " should now be " + newAvail);

    Car.updateOne(
        {_id: req.body._id},
        {$set: {"avail": newAvail}},
        {runValidators: true},
        (err, info) => {
            if (err) {
                console.log(err.message);
                console.log(JSON.stringify(err.errors));
            } else {
                console.log(info);
                res.redirect(`/detail.html?car_id=${req.body._id}`);
            }
        }
    )
});

//Save the car to the database
app.post("/new-car", (req, res) => {
    console.log("when creating a new car, my availability is: " + req.body.available);
    const car = {
        stock_num: req.body.stock_num,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        url: req.body.url,
        price: req.body.price,
        avail: req.body.available
    }

    //this does not correctly return specific stringified json errors
    // will need to interpret the errors in a user friendly manner
    if (req.body._id) {
        Car.updateOne(
            {_id: req.body._id},
            {$set: car},
            {runValidators: true},
            (err, info) => {
                if (err) {
                    console.log(err.message);
                    //we will need this error part for the homework
                    //identify which field is incorrect after redirect
                    //cannot have line breaks
                    console.log(JSON.stringify(err.errors));
                    res.redirect(`/edit.html?error_message=${JSON.stringify(err.errors)}&input=${JSON.stringify(car)}&car_id=${req.body._id}`);
                } else {
                    console.log(info);
                    res.redirect(`/detail.html?car_id=${req.body._id}`);
                }
            }
        )
    } else {
        //car does not exist so we create a new car
        const nc = new Car(car);
        nc.save(function (err, new_car) {
            if (err) {
                console.log(err["message"]);
                res.redirect("/edit.html?error_message="
                    + err["message"] + "&input=" + JSON.stringify(car));
            } else {
                console.log(new_car._id);
                res.redirect("/detail.html?car_id=" + new_car._id);
            }
        });
    }
});

app.get("/get_all_cars", function (req, res) {
    Car.find(function (err, data) {
        if (err) {
            // sending json file for client to be able to read
            res.send({
                "message": "internal server error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            });
        }
    });
});

app.get('/get_car_by_id',
    function (req, res) {
        console.log(req.query.car_id);
        Car.find({"_id": req.query.car_id}, function (err, data) {
            if (err || data.length === 0) {
                // sending json file for client to be able to read
                res.send({
                    "message": "internal database error",
                    "data": {}
                });
            } else {
                res.send({
                    "message": "success",
                    "data": data[0]
                });
            }
        });
    });

// - post uses body for params
// - get uses query for params
// Get cars by keyword and specified filters
app.get("/get_cars_by_filters", (req, res) => {
    const time = new Date();

    let ak = req.query.availability_key;//either true or false
    console.log("ak initially: " + ak);
    let sk = req.query.search_key;

    let min_yr = req.query.min_year;
    if (!min_yr) {// if min_yr is empty set to 1900
        min_yr = 1900;
    }
    let max_yr = req.query.max_year;
    if (!max_yr) {// USING CURRENT YEAR FROM DATE OBJECT
        max_yr = time.getFullYear();
    }
    let min_pr = req.query.min_price;
    if (!min_pr) {// if min_pr is empty set to 0
        min_pr = 0;
    }
    let max_pr = req.query.max_price;
    if (!max_pr) {
        max_pr = 100000000;
    }
    console.log(sk, min_yr, max_yr, min_pr, max_pr, ak);

    if (ak === "true") {
        Car.find({ // filter with availability specifications
            $and: [
                {year: {$gte: min_yr}},
                {year: {$lte: max_yr}},
                {price: {$gte: min_pr}},
                {price: {$lte: max_pr}},
                {
                    $or: [
                        {make: {$regex: sk}},
                        {model: {$regex: sk}}
                    ]
                },
                {avail: {$regex: "available"}}
            ]
        }, (err, data) => {
            if (err) {
                res.send(
                    {
                        "message": "db_error",
                        "data": []
                    })
            } else {
                res.send({
                    "message": "success",
                    "data": data
                })
            }
            console.log(data);
        });
    } else {
        console.log("without spefs");
        Car.find({ // filter without availability specifications
            $and: [
                {year: {$gte: min_yr}},
                {year: {$lte: max_yr}},
                {price: {$gte: min_pr}},
                {price: {$lte: max_pr}},
                {
                    $or: [
                        {make: {$regex: sk}},
                        {model: {$regex: sk}}
                    ]
                }
            ]
        }, (err, data) => {
            if (err) {
                res.send(
                    {
                        "message": "db_error",
                        "data": []
                    })
            } else {
                res.send({
                    "message": "success",
                    "data": data
                })
            }
            console.log(data);
        });
    }
});

// Delete car by id
app.post('/delete_car_by_id', (req, res) => {
    Car.deleteOne(
        {"_id": req.body._id},
        {},
        (err) => {
            if (err) {
                res.send({"message": "database error"});
            } else {
                res.send({"message": "success"});
            }
        }
    )
});