// basically we just dump data into database, we run it once
const mongoose = require('mongoose');
const fs = require('fs');

const parse = require('csv-parse/lib/sync')
// const assert = require('assert')

// can use readFileSync here instead of all of this
const input = `
stock_num,make,model,year,color,url,price
19913071,Toyota,Corolla,2015,Red,https://img2.carmax.com/img/vehicles/19913071/1.jpg?width=800,14715
20319754,Hyundai,Sonata,2018,Black,https://img2.carmax.com/img/vehicles/20319754/1.jpg?width=800,14102
20322507,Kia,Optima,2018,Gray,https://img2.carmax.com/img/vehicles/20322507/1.jpg?width=800,2644
20322520,Kia,Optima,2018,Black,https://img2.carmax.com/img/vehicles/20322520/1.jpg?width=800,11016
20196030,Nissan,Sentra,2019,White,https://img2.carmax.com/img/vehicles/20196030/1.jpg?width=800,7377
20196050,Nissan,Sentra,2019,Black,https://img2.carmax.com/img/vehicles/20196050/1.jpg?width=800,6988
19662328,Mazda,Mazda3,2016,Black,https://img2.carmax.com/img/vehicles/19662328/1.jpg?width=800,7497
19913278,Ford,Taurus,2017,Black,https://img2.carmax.com/img/vehicles/19913278/1.jpg?width=800,12478
19912988,Chevrolet,Malibu,2016,Black,https://img2.carmax.com/img/vehicles/19912988/1.jpg?width=800,10529
20214390,Toyota,Camry,2018,Black,https://img2.carmax.com/img/vehicles/20214390/1.jpg?width=800,14538
19912880,Toyota,Corolla,2016,White,https://img2.carmax.com/img/vehicles/19912880/1.jpg?width=800,9314
19912965,Honda,Accord,2020,White,https://img2.carmax.com/img/vehicles/19912965/1.jpg?width=800,9769
19662236,Honda,Civic,2015,Silver,https://img2.carmax.com/img/vehicles/19662236/1.jpg?width=800,4589
19913309,Dodge,Dart,2013,Silver,https://img2.carmax.com/img/vehicles/19913309/1.jpg?width=800,13095
19662337,Nissan,Sentra,2012,Gray,https://img2.carmax.com/img/vehicles/19662337/1.jpg?width=800,12296
19662464,Toyota,Corolla,2009,White,https://img2.carmax.com/img/vehicles/19662464/1.jpg?width=800,12689
19912516,Nissan,Rogue,2016,Black,https://img2.carmax.com/img/vehicles/19912516/1.jpg?width=800,9934
19913075,Toyota,Highlander,2019,Gray,https://img2.carmax.com/img/vehicles/19913075/1.jpg?width=800,3133
20196317,Chevrolet,Sonic,2016,White,https://img2.carmax.com/img/vehicles/20196317/1.jpg?width=800,8992
19662161,Chevrolet,Silverado,2017,White,https://img2.carmax.com/img/vehicles/19662161/1.jpg?width=800,9669
20095125,BMW,328,2015,Black,https://img2.carmax.com/img/vehicles/20095125/1.jpg?width=800,11493
19912842,Honda,Accord,2019,Gray,https://img2.carmax.com/img/vehicles/19912842/1.jpg?width=800,11143
19095578,Toyota,RAV4,2016,Black,https://img2.carmax.com/img/vehicles/19095578/1.jpg?width=800,4987
19912887,Ford,F150,2017,White,https://img2.carmax.com/img/vehicles/19912887/1.jpg?width=800,14116
19847708,Jeep,Grand,2017,Silver,https://img2.carmax.com/img/vehicles/19847708/1.jpg?width=800,6604
20279317,Jeep,Cherokee,2019,Black,https://img2.carmax.com/img/vehicles/20279317/1.jpg?width=800,7324
20196626,Toyota,Highlander,2016,Black,https://img2.carmax.com/img/vehicles/20196626/1.jpg?width=800,6159
19912797,Toyota,RAV4,2016,Gray,https://img2.carmax.com/img/vehicles/19912797/1.jpg?width=800,2740
19156475,Chevrolet,Cruze,2016,Black,https://img2.carmax.com/img/vehicles/19156475/1.jpg?width=800,10523
20220199,Jeep,Wrangler,2017,White,https://img2.carmax.com/img/vehicles/20220199/1.jpg?width=800,2324
19156597,Jeep,Cherokee,2017,Red,https://img2.carmax.com/img/vehicles/19156597/1.jpg?width=800,8178
19912741,Ford,Explorer,2015,Gray,https://img2.carmax.com/img/vehicles/19912741/1.jpg?width=800,6384
20196239,Honda,Odyssey,2020,Gray,https://img2.carmax.com/img/vehicles/20196239/1.jpg?width=800,10556
19912861,Honda,HR-V,2016,Black,https://img2.carmax.com/img/vehicles/19912861/1.jpg?width=800,1685
19912991,Toyota,RAV4,2015,Black,https://img2.carmax.com/img/vehicles/19912991/1.jpg?width=800,3557
19882956,Chevrolet,Tahoe,2020,Black,https://img2.carmax.com/img/vehicles/19882956/1.jpg?width=800,12310
19912618,BMW,320,2014,Blue,https://img2.carmax.com/img/vehicles/19912618/1.jpg?width=800,9680
19662073,Chevrolet,Silverado,2015,White,https://img2.carmax.com/img/vehicles/19662073/1.jpg?width=800,7699
18755882,Subaru,Forester,2012,White,https://img2.carmax.com/img/vehicles/18755882/1.jpg?width=800,9265
19424826,Toyota,Tacoma,2014,Red,https://img2.carmax.com/img/vehicles/19424826/1.jpg?width=800,2289
19912821,Toyota,Tacoma,2014,Silver,https://img2.carmax.com/img/vehicles/19912821/1.jpg?width=800,6107
19156553,Honda,CR-V,2014,Brown,https://img2.carmax.com/img/vehicles/19156553/1.jpg?width=800,3883
19662204,Subaru,Impreza,2010,Blue,https://img2.carmax.com/img/vehicles/19662204/1.jpg?width=800,6464
20196303,Lexus,ES,2010,Red,https://img2.carmax.com/img/vehicles/20196303/1.jpg?width=800,5275
19555596,Nissan,Juke,2012,Silver,https://img2.carmax.com/img/vehicles/19555596/1.jpg?width=800,6778
19912946,Hyundai,Santa,2009,Green,https://img2.carmax.com/img/vehicles/19912946/1.jpg?width=800,7247
19662076,Jeep,Wrangler,2013,White,https://img2.carmax.com/img/vehicles/19662076/1.jpg?width=800,7121
20254230,Kia,Sorento,2018,Red,https://img2.carmax.com/img/vehicles/20254230/1.jpg?width=800,7424
20254831,Kia,Sorento,2018,Red,https://img2.carmax.com/img/vehicles/20254831/1.jpg?width=800,4237
20013314,Subaru,Outback,2018,Gray,https://img2.carmax.com/img/vehicles/20013314/1.jpg?width=800,3421
20013380,Subaru,Outback,2018,Black,https://img2.carmax.com/img/vehicles/20013380/1.jpg?width=800,7241
20279893,Nissan,Rogue,2018,Black,https://img2.carmax.com/img/vehicles/20279893/1.jpg?width=800,1166
20013206,Subaru,Crosstrek,2017,Silver,https://img2.carmax.com/img/vehicles/20013206/1.jpg?width=800,5458
20227023,Mercedes-Benz,CLA250,2018,Blue,https://img2.carmax.com/img/vehicles/20227023/1.jpg?width=800,1927
20279852,Nissan,Rogue,2018,Gray,https://img2.carmax.com/img/vehicles/20279852/1.jpg?width=800,14518
19913080,Jaguar,XE,2017,Silver,https://img2.carmax.com/img/vehicles/19913080/1.jpg?width=800,9250
19662259,Subaru,WRX,2019,Silver,https://img2.carmax.com/img/vehicles/19662259/1.jpg?width=800,14233
20280284,BMW,530,2018,Black,https://img2.carmax.com/img/vehicles/20280284/1.jpg?width=800,7602
19662246,Mazda,MX-5,2016,White,https://img2.carmax.com/img/vehicles/19662246/1.jpg?width=800,13533
20279544,Mini,Cooper,2019,Gray,https://img2.carmax.com/img/vehicles/20279544/1.jpg?width=800,7286
19156511,Ford,Focus,2018,White,https://img2.carmax.com/img/vehicles/19156511/1.jpg?width=800,7915
19913184,Hyundai,Tucson,2015,Red,https://img2.carmax.com/img/vehicles/19913184/1.jpg?width=800,12706
19913190,Toyota,Corolla,2018,Gray,https://img2.carmax.com/img/vehicles/19913190/1.jpg?width=800,1487
20247830,GMC,Sierra,2017,Brown,https://img2.carmax.com/img/vehicles/20247830/1.jpg?width=800,1113
19662273,Subaru,Impreza,2016,Silver,https://img2.carmax.com/img/vehicles/19662273/1.jpg?width=800,12045
20196014,Dodge,Durango,2017,Gray,https://img2.carmax.com/img/vehicles/20196014/1.jpg?width=800,8898
20104879,Toyota,Corolla,2018,Blue,https://img2.carmax.com/img/vehicles/20104879/1.jpg?width=800,5088
20279084,Toyota,Highlander,2018,Black,https://img2.carmax.com/img/vehicles/20279084/1.jpg?width=800,11934
20227138,Mercedes-Benz,E300,2017,Blue,https://img2.carmax.com/img/vehicles/20227138/1.jpg?width=800,4933
20226547,Mercedes-Benz,E300,2019,Silver,https://img2.carmax.com/img/vehicles/20226547/1.jpg?width=800,5241
20104643,Toyota,Highlander,2018,Red,https://img2.carmax.com/img/vehicles/20104643/1.jpg?width=800,3003
20196910,Jeep,Compass,2018,Black,https://img2.carmax.com/img/vehicles/20196910/1.jpg?width=800,6603
20227289,Mercedes-Benz,GLS450,2017,Black,https://img2.carmax.com/img/vehicles/20227289/1.jpg?width=800,7454
20278951,Jeep,Cherokee,2018,Gray,https://img2.carmax.com/img/vehicles/20278951/1.jpg?width=800,7998
19913013,Nissan,Rogue,2016,Gray,https://img2.carmax.com/img/vehicles/19913013/1.jpg?width=800,5118
19662251,Toyota,Prius,2017,Blue,https://img2.carmax.com/img/vehicles/19662251/1.jpg?width=800,12857
19912713,Toyota,Tundra,2018,Silver,https://img2.carmax.com/img/vehicles/19912713/1.jpg?width=800,8125
20356202,Jeep,Cherokee,2018,Silver,https://img2.carmax.com/img/vehicles/20356202/1.jpg?width=800,6979
19156564,Nissan,Versa,2015,Silver,https://img2.carmax.com/img/vehicles/19156564/1.jpg?width=800,7199
19913104,Hyundai,Elantra,2014,White,https://img2.carmax.com/img/vehicles/19913104/1.jpg?width=800,7907
20214361,Honda,Accord,2018,White,https://img2.carmax.com/img/vehicles/20214361/1.jpg?width=800,9602
20196034,Chevrolet,Silverado,2018,Black,https://img2.carmax.com/img/vehicles/20196034/1.jpg?width=800,5480
20196902,Jeep,Grand,2018,Black,https://img2.carmax.com/img/vehicles/20196902/1.jpg?width=800,9050
19913186,BMW,X6,2017,Gray,https://img2.carmax.com/img/vehicles/19913186/1.jpg?width=800,12219
19912911,Toyota,RAV4,2019,Gray,https://img2.carmax.com/img/vehicles/19912911/1.jpg?width=800,13844
20279684,Jeep,Wrangler,2018,Silver,https://img2.carmax.com/img/vehicles/20279684/1.jpg?width=800,12103
19156358,Toyota,RAV4,2019,Silver,https://img2.carmax.com/img/vehicles/19156358/1.jpg?width=800,12367
19912765,Jeep,Grand,2018,White,https://img2.carmax.com/img/vehicles/19912765/1.jpg?width=800,14611
19156571,Ford,Explorer,2017,Gold,https://img2.carmax.com/img/vehicles/19156571/1.jpg?width=800,12204
19662058,Toyota,Tacoma,2019,Silver,https://img2.carmax.com/img/vehicles/19662058/1.jpg?width=800,12182
19912980,Chevrolet,Silverado,2019,Red,https://img2.carmax.com/img/vehicles/19912980/1.jpg?width=800,4653
19912966,BMW,535,2016,White,https://img2.carmax.com/img/vehicles/19912966/1.jpg?width=800,6827
19912962,Dodge,Challenger,2015,Red,https://img2.carmax.com/img/vehicles/19912962/1.jpg?width=800,4087
19913238,Chevrolet,Silverado,2019,White,https://img2.carmax.com/img/vehicles/19913238/1.jpg?width=800,9975
20104974,Toyota,Tacoma,2019,Black,https://img2.carmax.com/img/vehicles/20104974/1.jpg?width=800,6681
19156468,Ford,Expedition,2017,Black,https://img2.carmax.com/img/vehicles/19156468/1.jpg?width=800,12904
20013384,Chevrolet,Silverado,2017,White,https://img2.carmax.com/img/vehicles/20013384/1.jpg?width=800,11860
20013375,Jeep,Grand,2017,Gray,https://img2.carmax.com/img/vehicles/20013375/1.jpg?width=800,1010
19913277,Toyota,Camry,2016,Blue,https://img2.carmax.com/img/vehicles/19913277/1.jpg?width=800,14942
19707063,Chevrolet,Silverado,2017,Blue,https://img2.carmax.com/img/vehicles/19707063/1.jpg?width=800,2121
19912680,Toyota,Highlander,2016,Blue,https://img2.carmax.com/img/vehicles/19912680/1.jpg?width=800,4230
19912627,Honda,Pilot,2019,Green,https://img2.carmax.com/img/vehicles/19912627/1.jpg?width=800,13092
19156636,Honda,Pilot,2016,Black,https://img2.carmax.com/img/vehicles/19156636/1.jpg?width=800,13832
20319763,Jeep,Wrangler,2017,White,https://img2.carmax.com/img/vehicles/20319763/1.jpg?width=800,4720
19156639,Ford,Explorer,2015,Black,https://img2.carmax.com/img/vehicles/19156639/1.jpg?width=800,2365
20195904,Jeep,Renegade,2016,Gray,https://img2.carmax.com/img/vehicles/20195904/1.jpg?width=800,5582
19503825,Chevrolet,Colorado,2016,Black,https://img2.carmax.com/img/vehicles/19503825/1.jpg?width=800,5452
20013177,Mercedes-Benz,E350,2014,White,https://img2.carmax.com/img/vehicles/20013177/1.jpg?width=800,13033
19913021,Chevrolet,Impala,2014,Silver,https://img2.carmax.com/img/vehicles/19913021/1.jpg?width=800,12490
20219614,Jeep,Grand,2020,White,https://img2.carmax.com/img/vehicles/20219614/1.jpg?width=800,13732
20116229,Chevrolet,Tahoe,2020,White,https://img2.carmax.com/img/vehicles/20116229/1.jpg?width=800,2278
19662040,Subaru,Forester,2013,Red,https://img2.carmax.com/img/vehicles/19662040/1.jpg?width=800,4160
19912611,Jeep,Cherokee,2014,Black,https://img2.carmax.com/img/vehicles/19912611/1.jpg?width=800,5682
19156634,Toyota,Prius,2012,Silver,https://img2.carmax.com/img/vehicles/19156634/1.jpg?width=800,5834
19913088,Honda,CR-V,2011,Black,https://img2.carmax.com/img/vehicles/19913088/1.jpg?width=800,12402
19662255,Dodge,Challenger,2009,Orange,https://img2.carmax.com/img/vehicles/19662255/1.jpg?width=800,8828
19913010,Toyota,Prius,2010,Black,https://img2.carmax.com/img/vehicles/19913010/1.jpg?width=800,9523
`


const records = parse(input, {
    columns: true,
    skip_empty_lines: true
})
// assert.deepStrictEqual(records, [{ key_1: 'value 1', key_2: 'value 2' }])
// console.log(records);


//connect to mongodb server
mongoose.connect('mongodb://localhost:27017/carsDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

// Note that I set the stock number as a string
const carSchema = {
    stock_num: String,
    make: String,
    model: String,
    year: Number,
    color: String,
    url: String,
    price: Number,
    avail: String
}

const Car = mongoose.model('Car', carSchema);

//create list of cars to save into database
const carList = [];

records.forEach(function (car) {
    //make sure all of the strings align with how we define the moviedb strings
    carList.push({
        "stock_num": car["stock_num"],
        "make": car["make"],
        "model": car["model"],
        "year": car["year"],
        "color": car["color"],
        "url": car["url"],
        "price": car["price"],
        "avail": "available"
    });
    console.log("added car: " + car["model"]);
});

Car.insertMany(carList, {}, function (err) {
    //when err is not empty or none do this
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved successfully!");
        mongoose.connection.close();
    }
});

// ctrl + C terminates

// mongo
// use movieDB
// db.movies.find()