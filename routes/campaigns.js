var express = require('express');
var router = express.Router();

/* GET listing of all campaigns */
router.get('/', function(req, res, next) {
    res.render('campaigns/index', { });
});

// GET to the add campaign form
router.get('/add', function(req, res, next) {
    res.render('campaigns/edit', { title: "Add a Campaign" });
});

// POST to add a new campaign
router.post('/save', async (req, res, next) => {
    // Logic to save new campaign
    console.log("Saving a new campaign.");
    res.send("Adding a new campaign.");
});

module.exports = router;
