var express = require('express');
var router = express.Router();

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I9owlAkRzH7t3WnfFEJr1wZZoztlBecdPMC2dB4gTs6zqdaVuWA1MaLGfGwAQJUQG3YNdKULvdYWr34xAtfmnjU00Y1Op6qCl');

var dataBike = [
    { name: "BIKO45", url: "/images/bike-1.jpg", price: 679, mea: true, quantity: 10 },
    { name: "ZOOK07", url: "/images/bike-2.jpg", price: 999, mea: false, quantity: 0 },
    { name: "TITANS", url: "/images/bike-3.jpg", price: 799, mea: true, quantity: 20 },
    { name: "CEWO", url: "/images/bike-4.jpg", price: 1300, mea: false, quantity: 5 },
    { name: "AMIG039", url: "/images/bike-5.jpg", price: 479, mea: true, quantity: 17 },
    { name: "LIK099", url: "/images/bike-6.jpg", price: 869, mea: false, quantity: 12 }
]

const couponArray = [{ name: "REDUC25", type: "percent", value: 25 }, { name: "MOINS100", type: "value", value: 100 }]

function shippingCostComputing(total, quantity, type) {
    var intTotal = parseInt(total)
    var intQty = parseInt(quantity)
    var shippingCost = 0

    switch (type) {
        case 'standard':
            if (intTotal >= 4000) {
                shippingCost = 0
            } else if (intTotal >= 2000 && total < 4000) {
                shippingCost = intQty * 30 / 2
            } else {
                shippingCost = intQty * 30
            }
            break;
        case 'express':
            if (intTotal >= 4000) {
                shippingCost = 100
            } else if (intTotal >= 2000 && total < 4000) {
                shippingCost = (intQty * 30 / 2) + 100
            } else {
                shippingCost = (intQty * 30) + 100
            }
            break;
        case 'relais':
            shippingCost = 50 + 20 * intQty
    }

    return shippingCost
}


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(dataBike[0].mea)
    res.render('index', { dataBike });
});

router.get('/confirm', function(req, res, next) {
    res.render('confirm', {});
});

router.get('/shop', function(req, res, next) {
    if (req.session.dataCardBike === []) {
        delete req.session.dataCardBike;
    }
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});


router.get('/add-basket', function(req, res, next) {
    for (i = 0; i < dataBike.length; i++) {
        if (req.query.name === dataBike[i].name) {
            var quantityCheck = dataBike[i].quantity
        }
    }

    if (typeof req.session.dataCardBike === 'undefined') {
        req.session.dataCardBike = []
        req.session.dataCardBike.push({ name: req.query.name, picture: req.query.img, qty: req.query.qty, price: req.query.price })
    } else {
        var newItem = true
        for (i = 0; i < req.session.dataCardBike.length; i++) {
            if (req.query.name === req.session.dataCardBike[i].name) {
                newItem = false
                if (quantityCheck >= parseInt(req.session.dataCardBike[i].qty, 10) + 1) {
                    req.session.dataCardBike[i].qty = parseInt(req.session.dataCardBike[i].qty, 10) + 1
                }
            }
        }
        if (newItem) {
            req.session.dataCardBike.push({ name: req.query.name, picture: req.query.img, qty: req.query.qty, price: req.query.price })
        }
    };

    req.session.total = 0
    req.session.totalQuantity = 0
    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        req.session.total += (req.session.dataCardBike[i].price * parseInt(req.session.dataCardBike[i].qty))
        req.session.totalQuantity += parseInt(req.session.dataCardBike[i].qty)
    }

    req.session.shipType = 'standard'
    req.session.shipping = {
        name: "Shipping Cost",
        cost: shippingCostComputing(req.session.total, req.session.totalQuantity, req.session.shipType),
        type: req.session.shipType
    }

    req.session.reduction = 0

    res.render('shop', {
        dataCardBike: req.session.dataCardBike,
        total: req.session.total,
        shippingCost: req.session.shipping,
        reduction: req.session.reduction
    });
});

router.get('/delete-shop', function(req, res, next) {
    req.session.dataCardBike.splice(req.query.position, 1)
    if (req.session.dataCardBike === []) {
        delete req.session.dataCardBike;
    }
    res.render('shop', { dataCardBike: req.session.dataCardBike });
});

router.post('/update-shipping', function(req, res) {
    console.log(req.body.shippingtype)
    req.session.shipType = req.body.shippingtype
    req.session.shipping = {
        name: "Shipping Cost",
        cost: shippingCostComputing(req.session.total, req.session.totalQuantity, req.session.shipType),
        type: req.session.shipType
    }
    res.render('shop', {
        dataCardBike: req.session.dataCardBike,
        total: req.session.total,
        shippingCost: req.session.shipping,
        reduction: req.session.reduction
    })
})

router.post('/update-shop', function(req, res) {
    for (i = 0; i < dataBike.length; i++) {
        if (req.session.dataCardBike[req.body.button].name === dataBike[i].name) {
            var quantityCheck = dataBike[i].quantity
        }
    }

    if (quantityCheck >= req.body.quantity) {
        req.session.dataCardBike[req.body.button].qty = req.body.quantity
    }

    req.session.total = 0
    req.session.totalQuantity = 0

    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        req.session.total += (req.session.dataCardBike[i].price * parseInt(req.session.dataCardBike[i].qty))
        req.session.totalQuantity += parseInt(req.session.dataCardBike[i].qty)
    }

    req.session.shipping = {
        name: "Shipping Cost",
        cost: shippingCostComputing(req.session.total, req.session.totalQuantity, req.session.shipType),
        type: req.session.shipType
    }

    res.render('shop', {
        dataCardBike: req.session.dataCardBike,
        total: req.session.total,
        shippingCost: req.session.shipping,
        reduction: req.session.reduction
    });
});


router.post('/create-checkout-session', async(req, res) => {
    var basketList = []
    for (i = 0; i < req.session.dataCardBike.length; i++) {
        basketList.push({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: req.session.dataCardBike[i].name,
                    },
                    unit_amount: parseInt(req.session.dataCardBike[i].price) * 100,
                },
                quantity: parseInt(req.session.dataCardBike[i].qty),
            },
            // 
        )
    }

    basketList.push({
        price_data: {
            currency: "eur",
            product_data: {
                name: "Shipping Cost",
            },
            unit_amount: req.session.shipping.cost * 100,
        },
        quantity: 1,
    }, )

    if (req.session.reduction != 0) {
        console.log(Math.floor(req.session.reduction * 100))
        basketList.push({
            price_data: {
                currency: "eur",
                product_data: {
                    name: "Coupon",
                },
                unit_amount: Math.floor(req.session.reduction * 100),
            },
            quantity: 1,
        }, )
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: basketList,
        mode: 'payment',
        // success_url: 'https://stark-citadel-26838.herokuapp.com/confirm',
        // cancel_url: 'https://stark-citadel-26838.herokuapp.com/',
        success_url: 'http://localhost:3000/confirm',
        cancel_url: 'http://localhost:3000/',
    });
    res.json({ id: session.id });
});

router.post('/coupon', function(req, res) {
    console.log(req.body.couponCode)
    var check = false
    for (i = 0; i < couponArray.length; i++) {
        if (req.body.couponCode === couponArray[i].name) {
            var couponType = couponArray[i].type
            var couponValue = couponArray[i].value
            check = true
        }
    }
    console.log(couponValue)

    if (check) {
        switch (couponType) {
            case "percent":
                req.session.reduction = -(req.session.total * couponValue / 100)
                break;

            case "value":
                req.session.reduction = -couponValue
                break;
        }
    }

    req.session.total = 0
    req.session.totalQuantity = 0

    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        req.session.total += (req.session.dataCardBike[i].price * parseInt(req.session.dataCardBike[i].qty))
        req.session.totalQuantity += parseInt(req.session.dataCardBike[i].qty)
    }

    req.session.total = req.session.total + req.session.reduction

    res.render('shop', {
        dataCardBike: req.session.dataCardBike,
        total: req.session.total,
        shippingCost: req.session.shipping,
        reduction: req.session.reduction
    })
})

router.get('/delete-coupon', function(req, res) {
    req.session.reduction = 0
    req.session.total = 0

    for (var i = 0; i < req.session.dataCardBike.length; i++) {
        req.session.total += (req.session.dataCardBike[i].price * parseInt(req.session.dataCardBike[i].qty))
    }

    req.session.total = req.session.total + req.session.reduction

    res.render('shop', {
        dataCardBike: req.session.dataCardBike,
        total: req.session.total,
        shippingCost: req.session.shipping,
        reduction: req.session.reduction
    })
})

module.exports = router;