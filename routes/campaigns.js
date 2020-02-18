var express = require('express');
var router = express.Router();
const campaigns = require('../models/campaign-memory');

/* GET listing of all campaigns */
router.get('/', function(req, res, next) {
    res.render('campaigns/index', { });
});

/* GET view a single campaign */
router.get('/view', async function(req, res, next) {
    var campaign = await campaigns.read(req.query.key);
    res.render('campaigns/view', { title: campaign.title, campaignkey: campaign.key, campaigndetail: campaign.campaigndetail });
});

// GET to the add campaign form
router.get('/add', function(req, res, next) {
    res.render('campaigns/edit', { title: "Add a Campaign" });
});

// POST to add a new campaign
router.post('/save', async (req, res, next) => {
    // Logic to save new campaign
    var campaign;
    campaign = await campaigns.create(req.body.campaignkey, req.body.title, req.body.campaigndetail);
    res.redirect('/campaigns/view?key=' + req.body.campaignkey);

    console.log("Saving a new campaign.");
    res.send("Adding a new campaign.");
});

module.exports = router;
