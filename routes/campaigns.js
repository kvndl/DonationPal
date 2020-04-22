var express = require('express');
var router = express.Router();
// const campaigns = require('../models/campaign-memory');
const Campaigns = require('../models/Campaign');
const User = require('../models/user');

/* GET listing of all campaigns */
router.get('/', async function(req, res, next) {

    // let keylist = await campaigns.keylist();
    // let keyPromises = keylist.map( key => {
    //     return campaigns.read(key);
    // });

    // let campaignlist = await Promise.all(keyPromises);
    // const campaignlisting = async () => {
    //     const everything = await dbService.db.collection('campaigns').find({});
    //     console.log("--- Everything from Mongo " + everything);
    //     return everything;
    // }

    // check if user is logged in
    if (req.isAuthenticated()) {
        niceUser = new User(req.user);
        var getCampaigns = await Campaigns.getCampaigns();
        res.render('campaigns/index',
        { 
            title: "All Campaigns",
            campaignlist: getCampaigns,
            user: niceUser,
            
        });
    } else {
        res.render('user-noprofile');
    }
    
});

/* GET view a single campaign */
router.get('/view', async function(req, res, next) {
    var campaign = await Campaigns.viewSingleCampaign(req.query.key);
    res.render('campaigns/view',
    { 
        title: campaign[0].title,
        campaignkey: campaign[0].key,
        campaigndetail: campaign[0].campaigndetail,
        goalAmount: campaign[0].goalAmount
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
    let theKey = await makeid(5);
    campaign = await Campaigns.addCampaign({
        key: theKey,
        title: req.body.title,
        goalAmount: req.body.goalAmount,
        campaigndetail: req.body.campaigndetail
    });
    res.redirect('/campaigns/view?key=' + theKey);

    console.log("--- Saving a new campaign ---");
});

module.exports = router;

// Helper Functions

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