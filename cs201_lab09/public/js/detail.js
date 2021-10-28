let car = {
    "stock_num": 0,
    "make": "Honda",
    "model": "Civic",
    "year": "2010",
    "color": "silver",
    "url": "https://cars.usnews.com/static/images/Auto/izmo/321536/2010_honda_civic_sdn_angularfront.jpg",
    "price": "30000"
}

//puts values into html
function load_car(car) {
    // changing the text on the availability button to match if the car is available or not
    if (car.avail === "available") {
        $('#availBTN').html("Mark as sold");
        $('#availability').text("Available").css("color", "green");
    } else {
        $('#availBTN').html("Mark as available");
        $('#availability').text("Sold").css("color", "red");
    }
    // $('#availability').text(car.avail);
    $('#stock_number').text(car.stock_num);
    $('#maker').text(car.make);
    $('#model_car').text(car.model);
    $('#year_made').text(car.year);
    $('#car_img').attr('src', car.url);
    $('#car_color').text(car.color);
    $('#car_price').text(car.price);
}

// function getAvailability(){
//     // const localAvailability = car.avail
//     return car.avail;
// }

//when entire page has been loaded execute this function
$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const car_id = urlParams.get('car_id');
    console.log(car_id);
    if (car_id) {
        $.getJSON('/get_car_by_id?car_id=' + car_id).done(function (data) {
            // console.log(data);
            if (data["message"] === "success") {
                car = data["data"];
                load_car(car);
            }
        });
    }
});

function onEdit() {
    location.href = "/edit.html?car_id=" + car._id;
}

function onDelete() {
    $.post('/delete_car_by_id', {_id: car._id})
        .done((msg) => {
            if (msg.message === "success") {
                location.href = "/";
            }
        });
}

// changes a car's availability in the database
function changeAvailability() {
    // console.log("car model: " + car.model);
    let availa = document.getElementById("availability").innerText;

    if (availa === "Available") {
        availa = "available";
    } else {
        availa = "sold";
    }

    $.post('/changeAvail', {av: availa, _id: car._id});
    location.reload();
// .done((msg) => {
//         console.log("message: " + msg);
//         if (msg.message === "success") {
//             // location.href = "/edit.html?car_id=" + car._id;
//             location.reload();
//         }
//     })

}