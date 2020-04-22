var express = require('express');
var router = express.Router();
const campaigns = require('../models/campaign-memory');
const User = require('../models/user');

/* GET listing of all campaigns */
router.get('/', async function(req, res, next) {

    let keylist = await campaigns.keylist();
    let keyPromises = keylist.map( key => {
        return campaigns.read(key);
    });

    let campaignlist = await Promise.all(keyPromises);
    // check if user is logged in
    if (req.isAuthenticated()) {
        niceUser = new User(req.user);
        res.render('campaigns/index',
        { 
            title: "My Campaigns",
            campaignlist: campaignlist,
            user: niceUser
        });
    } else {
        res.render('user-noprofile');
    }
    
});

/* GET view a single campaign */
router.get('/view', async function(req, res, next) {
    var campaign = await campaigns.read(req.query.key);
    res.render('campaigns/view',
    { 
        title: campaign.title,
        campaignkey: campaign.key,
        campaigndetail: campaign.campaigndetail
    });
});

// GET to the add campaign form
router.get('/add', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('campaigns/edit', { title: "Add a Campaign" });
    }
});

// POST to add a new campaign
router.post('/save', async (req, res, next) => {
    // Logic to save new campaign
    var campaign;
    campaign = await campaigns.create(req.body.campaignkey, req.body.title, req.body.campaigndetail);
    res.redirect('/campaigns/view?key=' + req.body.campaignkey);

    console.log("Saving a new campaign.");
});

module.exports = router;
