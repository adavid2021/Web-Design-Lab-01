function showList(cars) {
    $('#car_list').empty();

    // add a car list item for each car received from the cars data
    for (let i = 0; i < cars.length; i++) {
        $('#car_list').append("<li class='list-group-item'></li>");
    }

    // added ObjectId to each object, now accessible on client side
    $('#car_list li')
        .attr("value", function (idx) {
            return cars[idx]._id;
        })
        .append("<div class='row' style='height: 40px'></div>");

    // adding alternating colors for car list rows
    $('#car_list .row').addClass(function (idx) {
        if (idx % 2 === 0) {
            return 'even_row';
        } else {
            return 'odd_row';
        }
    });

    $('#car_list .row')
        .append("<div class='col-2 make'></div>")
        .append("<div class='col-2 model'></div>")
        .append("<div class='col-2 year'></div>")
        .append("<div class='col-2 price'></div>")
        .append("<div class='col-2 availability'></div>")
        .append("<div class='col-2'><button type='button' class='btn btn-outline-primary carButton'>Show More</button></div>")

    // setting the information for each car added to the car list
    $('.make').append(function (idx) {
        return `<p>${cars[idx].make}</p>`
    });

    $('.model').append(function (idx) {
        return `<p>${cars[idx].model}</p>`
    });

    $('.year').append(function (idx) {
        return `<p>${cars[idx].year}</p>`
    });

    $('.price').append(function (idx) {
        return `<p>${cars[idx].price}</p>`
    });

    $('.availability').append(function (idx) {
        return `<p>${cars[idx].avail}</p>`
    });

    // specific item based on object ID
    $('.carButton').on('click', function () {
        const carId = $(this).parents('li').attr("value");
        // navigates to a client page
        location.href = "detail.html?car_id=" + carId;
    });
}

//when entire page has been loaded execute this function
$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sort = urlParams.get('sort');

    // displaying car list based on selected sort filter (if there is one in the URL parameters)
    if (sort === 'make') {
        $.getJSON("/get_all_cars").done(function (data) {
            if (data.message === "success") {
                console.log("MAKING IT");
                showList(data["data"].sort((a, b) => (a.make > b.make) ? 1 : -1));
            }
        });
    } else if (sort === 'model') {
        $.getJSON("/get_all_cars").done(function (data) {
            if (data.message === "success") {
                showList(data["data"].sort((a, b) => (a.model > b.model) ? 1 : -1));
            }
        });
    } else if (sort === 'available') {
        $.getJSON("/get_all_cars").done(function (data) {
            if (data.message === "success") {
                showList(data["data"].sort((a, b) => (a.avail > b.avail) ? 1 : -1));
            }
        });
    } else if (sort === 'year') {
        $.getJSON("/get_all_cars").done(function (data) {
            if (data.message === "success") {
                showList(data["data"].sort((a, b) => (a.year > b.year) ? 1 : -1));
            }
        });
    } else {
        $.getJSON("/get_all_cars").done(function (data) {
            if (data.message === "success") {
                showList(data["data"].sort((a, b) => (parseInt(a.price) > parseInt(b.price)) ? 1 : -1));
            }
        });
    }
});

function searchCar() {
    // sent to server trying to get information from server based on user input
    $.get("/get_cars_by_filters", {
        availability_key: $("#show_available").is(':checked'),
        search_key: $('#search_box').val(),
        min_year: $('#min_year').val(),
        max_year: $('#max_year').val(),
        min_price: $('#min_price').val(),
        max_price: $('#max_price').val()
    }).done((data)=>{
        if(data.message==="success"){
            showList(data.data);
        }
    });
}