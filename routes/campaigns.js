var express = require('express');
var router = express.Router();
// const campaigns = require('../models/campaign-memory');
const Campaigns = require('../models/Campaign');
const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/* GET listing of all campaigns */
router.get('/', async function(req, res, next) {

    // check if user is logged in
    if (req.isAuthenticated()) {
        niceUser = new User(req.user);
        var getCampaigns = await Campaigns.getCampaigns();
        res.render('campaigns/index',
        { 
            title: "All Campaigns",
            campaignlist: getCampaigns,
            user: niceUser            
        });
    } else {
        res.render('user-noprofile');
    }
    
});

/* GET view a single campaign */
router.get('/view', async function(req, res, next) {
    var campaign = await Campaigns.viewSingleCampaign(req.query.key);
    var donations = await Campaigns.getChargeInfo(req.query.key);
    res.render('campaigns/view',
    { 
        title: campaign[0].title,
        campaignkey: campaign[0].key,
        campaigndetail: campaign[0].campaigndetail,
        goalAmount: campaign[0].goalAmount,
        donations: donations
        // donationBy: donations[0].customer,
        // donationAmount: donations[0].charge
    });
});

// GET to the add campaign form
router.get('/add', async function(req, res, next) {
    if (req.isAuthenticated()) {
        let theKey = await makeid(5);
        res.render('campaigns/edit', {
            title: "Add a Campaign",
            key: theKey
        });
    }
});

// POST to add a new campaign
router.post('/save', async (req, res, next) => {
    // Logic to save new campaign
    var campaign;
    // let theKey = await makeid(5);
    campaign = await Campaigns.addCampaign({
        key: req.body.key,
        title: req.body.title,
        goalAmount: req.body.goalAmount,
        campaigndetail: req.body.campaigndetail
    });
    res.redirect('/campaigns/view?key=' + theKey);

    console.log("--- Saving a new campaign ---");
});

// GET new donation
router.get('/donate', async (req, res, next) => {
    var key = req.query.key;
    console.log("--- Key found from query: " + key)
    res.render('payments/index', {
        title: "Make a donation",
        campaign_id: key
    });
});

// POST a payment to Stripe
router.post('/donate/charge', async (req, res) => {
    try {
        var campaign_id = req.body.campaign_id;
        var customer = await createCustomer(req);
        var charge = await createCharge(
            req.body.amount,
            customer,
            campaign_id
        );
        // Save data to mongodb
        await Campaigns.addNewCharge(customer, charge, campaign_id);
        console.log("--- Sent data to mongo ---");

        res.render('payments/completed', {
            customer: customer,
            charge: charge,
            campaign_id: campaign_id
        });
    } catch (err) {
        res.render('oopsie', {
            errorMsg: err
        });
    }
});

module.exports = router;

// Helper Functions

// Create "random" key from dictionary
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log('--- Unique ID generated: ' + result + ' ---');
    return result;
}

// Create new Stripe customer object
const createCustomer = async function(req) {
    var customer = await stripe.customers.create({

        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken

    });
    return customer;
}

// Create the actual charge sent to Stripe
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