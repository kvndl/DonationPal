const _campaign_key = Symbol('key');
const _campaign_title = Symbol('title');
const _campaign_body = Symbol('campaignbody');

module.exports = class Campaign {
    constructor(key, title, campaignbody) {
        this[_campaign_key] = key;
        this[_campaign_title] = title;
        this[_campaign_body] = campaignbody;
    };

    // Getters and Setters
    get key() { return this[_campaign_key]; }
    get title() { return this[_campaign_title]; }
    get campaignbody() { return this[_campaign_body]; }

    set key(newKey) { this[_campaign_key] = newKey; }
    set title(newTitle) { this[_campaign_title] = newTitle; }
    set campaignbody(newBody) { this[_campaign_body] = newBody; }
};