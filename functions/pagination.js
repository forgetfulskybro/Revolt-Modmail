class Paginator {
    constructor(pages = [], { user, client }) {
        this.pages = Array.isArray(pages) ? pages : [];
        this.client = client;
        this.user = user;
        this.page = 0;
        this.timeout = 5 * 2e4;
    }

    add(page) {
        this.pages.push(page);
        return this;
    }
 
    async start(channel) {
        if (!this.pages.length) return;
        const reactions = ["⬅️", "➡️"];
        const message1 = await channel.sendMessage({ embeds: [this.pages[0]] });
        await Promise.all(reactions.map((x, i) => { setTimeout(() => { message1.react(encodeURI(x)); }, i * 120); }));
        this.client.paginate.set(this.user, { pages: this.pages, page: this.page, message: message1._id });
        setTimeout(() => { this.client.paginate.delete(this.user) }, this.timeout);
    }
}

module.exports = Paginator;