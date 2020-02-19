const Campaign = require('./Campaign');

var campaigns = [];

exports.create = async function (key, title, campaigndetail) {
    campaigns[key] = new Campaign(key, title, campaigndetail);
    return campaigns[key];
}

exports.read = async function (key) {
    return campaigns[key];  
};

exports.keylist = async function() { return Object.keys(campaigns); };

exports.count = async function () { return campaigns.length; };

exports.close = async function () {};