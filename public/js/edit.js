// fill in the details based on the URL parameters
function fillCar(car) {
    $('#available').prop("checked", car.avail === "available");
    $('#sold').prop("checked", car.avail === "sold");
    $('#stock_num').val(car.stock_num);
    $('#make').val(car.make);
    $('#model').val(car.model);
    $('#year').val(car.year);
    $('#color').val(car.color);
    $('#url').val(car.url);
    $('#price').val(car.price);
}

// Get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const error_message = urlParams.get("error_message");
const input = JSON.parse(urlParams.get("input")); // converting back into json

if (error_message) {

    if (error_message.includes('price')) {
        $('#price').addClass('is-invalid text-danger');
    }
    if (error_message.includes('stock')) {
        $('#stock_num').addClass('is-invalid text-danger');
    }
    if (error_message.includes('year')) {
        $('#year').addClass('is-invalid text-danger');
    }

    let errList = error_message.substring(22,).split(',');
    let output = ""

    for (const err of errList) {
        output += err.split(':')[1].substring(1,) + ", ";
    }

    // setting the error on screen to a user friendly output
    $('#error_message').text(output.substring(0, output.length - 2));

    fillCar(input);
}

const car_id = urlParams.get("car_id");
console.log(car_id);

if (car_id && !error_message) {
    $.getJSON(`/get_car_by_id?car_id=${car_id}`)
        .done(function (data) {
            if (data["message"] === "success") {
                console.log(data["data"]);
                fillCar(data["data"]);
            }
        });
}

// when submitting an edit, check client side for missing car data
$('form').on('submit', function () {
    let errorMessage = null

    $.each($('input,textarea'), function () {
        $(this).removeClass('is-invalid text-danger')
    });

    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
            $(this).addClass('is-invalid text-danger');
            return false
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }

    //attach invisible form input to update the movie rather than add it
    if (car_id) {
        $('#edit_car form').append(() => {
            const input = $('<input>')
                .attr("name", "_id")
                .attr("value", car_id)
            return input
        });
        // return false;
    }
});


