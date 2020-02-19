const _campaign_key = Symbol('key');
const _campaign_title = Symbol('title');
const _campaign_detail = Symbol('campaigndetail');

module.exports = class Campaign {
    constructor(key, title, campaigndetail) {
        this[_campaign_key] = key;
        this[_campaign_title] = title;
        this[_campaign_detail] = campaigndetail;
    }

    // Getters and Setters
    get key() { return this[_campaign_key]; }
    get title() { return this[_campaign_title]; }
    get campaigndetail() { return this[_campaign_detail]; }

    set key(newKey) { this[_campaign_key] = newKey; }
    set title(newTitle) { this[_campaign_title] = newTitle; }
    set campaigndetail(newDetail) { this[_campaign_detail] = newDetail; }
};