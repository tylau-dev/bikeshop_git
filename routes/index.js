var express = require('express');
var router = express.Router();

// class Bike {
//     constructor(name, img, price) {
//         this._name = name;
//         this._img = img;
//         this._price = price;
//     }
//     get name() {
//         return this._name;
//     }

//     get img() {
//         return this._img;
//     }

//     get price() {
//         return this._price
//     }
// }
// const BIKO45 = new Bike('BIKO45', '/images/bike-1.jpg', '679€')
// const ZOOK07 = new Bike('ZOOK07', '/images/bike-2.jpg', '999€')
// const TITANS = new Bike('TITANS', '/images/bike-3.jpg', '799€')
// const CEWO = new Bike('CEWO', '/images/bike-4.jpg', '1300€')
// const AMIG39 = new Bike('AMIG39', '/images/bike-5.jpg', '479€')
// const LIKO99 = new Bike('LIKO99', '/images/bike-6.jpg', '869')

// var dataBike2 = [BIKO45, ZOOK07, TITANS, CEWO, AMIG39, LIKO99]

var dataBike = [
    { name: "BIKO45", url: "/images/bike-1.jpg", price: 679 },
    { name: "ZOOK07", url: "/images/bike-2.jpg", price: 999 },
    { name: "TITANS", url: "/images/bike-3.jpg", price: 799 },
    { name: "CEWO", url: "/images/bike-4.jpg", price: 1300 },
    { name: "AMIG039", url: "/images/bike-5.jpg", price: 479 },
    { name: "LIK099", url: "/images/bike-6.jpg", price: 869 }
]

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { dataBike });
});


// var dataCardBike = [
//     { row: 1, name: "BIKO45", picture: "/images/bike-1.jpg", qty: 1, price: 679 },
// ]

// var dataCardBike = []

router.get('/shop', function(req, res, next) {
    if (req.session.dataCardBike === []) {
        delete req.session.dataCardBike;
    }
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});


router.get('/add-basket', function(req, res, next) {
    console.log(req.query.name)
    console.log(req.session.dataCardBike)
    if (typeof req.session.dataCardBike === 'undefined') {
        req.session.dataCardBike = []
        req.session.dataCardBike.push({ name: req.query.name, picture: req.query.img, qty: req.query.qty, price: req.query.price })
    } else {
        var newItem = true
        for (i = 0; i < req.session.dataCardBike.length; i++) {
            if (req.query.name === req.session.dataCardBike[i].name) {
                console.log(req.session.dataCardBike[i].qty)
                console.log(typeof req.session.dataCardBike[i].qty)

                req.session.dataCardBike[i].qty = parseInt(req.session.dataCardBike[i].qty, 10) + 1
                newItem = false
            }
        }
        if (newItem) {
            req.session.dataCardBike.push({ name: req.query.name, picture: req.query.img, qty: req.query.qty, price: req.query.price })
        }
    }
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});

router.get('/delete-shop', function(req, res, next) {
    req.session.dataCardBike.splice(req.query.position, 1)
    if (req.session.dataCardBike === []) {
        delete req.session.dataCardBike;
    }
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});

router.post('/update-shop', function(req, res) {
    console.log(req.body)
    req.session.dataCardBike[req.body.button].qty = req.body.quantity
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});


module.exports = router;