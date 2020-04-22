var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// GET payment page
router.get('/', function(req, res, next) {
    res.render('payments/index');
});

// POST a payment form to Stripe
router.post('/charge', async (req, res) => {
    try {

        var campaign_id = req.body.campaign_id;
        var customer = await createCustomer(req);
        var charge = await createCharge(req.body.amount, customer, campaign_id);
        res.render('payments/completed', {customer: customer, charge: charge})

    } catch (err) {
        res.send(err);
    }
});

module.exports = router;

// Helper functions

const createCustomer = async function(req) {
    var customer = await stripe.customers.create({

        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken

    });
    return customer;
}

const createCharge = async function(amount, customer, campaign_id) {

    var charge = await stripe.charges.create({

        amount: amount * 100,
        currency: "usd",
        customer: customer.id,
        description: "Your donation to the ABC campaign",
        metadata: {
            campaign_id: campaign_id
        }

    });
    console.log('Charge: ' + JSON.stringify(charge, null, 1));
    return charge;
}