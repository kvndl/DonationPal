const dbService = require('../services/db');

class Campaign {

    // constructor(campaignData) {
    //     this.key = campaignData.key;
    //     this.userID = campaignData.userID;
    //     this.title = campaignData.title;
    //     this.campaigndetail = campaignData.campaigndetail;
    // }

    static async addCampaign(campaignData) {
        const newCampaign = await dbService.db.collection('campaigns').insertOne(campaignData);
        return newCampaign;
    }

    static async checkUserExists(userID) {
        const result = await dbService.db.collection('users').find({id: userID}).toArray();

        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    static async getCampaigns() {
        const everything = await dbService.db.collection('campaigns').find({}).toArray();
        console.log("--- Everything from Mongo " + JSON.stringify(everything, null, 1));
        return everything;
    }

    static async viewSingleCampaign(theKey) {
        const single = await dbService.db.collection('campaigns').find({key: theKey}).toArray();
        // const singleData = JSON.parse(single);
        console.log("--- Single document found " + JSON.stringify(single, null, 1));
        return single;
    }

}

module.exports = Campaign;

// const _campaign_key = Symbol('key');
// const _campaign_title = Symbol('title');
// const _campaign_detail = Symbol('campaigndetail');

// module.exports = class Campaign {
//     constructor(key, title, campaigndetail) {
//         this[_campaign_key] = key;
//         this[_campaign_title] = title;
//         this[_campaign_detail] = campaigndetail;
//     }

//     // Getters and Setters
//     get key() { return this[_campaign_key]; }
//     get title() { return this[_campaign_title]; }
//     get campaigndetail() { return this[_campaign_detail]; }

//     set key(newKey) { this[_campaign_key] = newKey; }
//     set title(newTitle) { this[_campaign_title] = newTitle; }
//     set campaigndetail(newDetail) { this[_campaign_detail] = newDetail; }
// };