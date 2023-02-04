class Paginator {
    constructor(pages = [], {
        filter,
        timeout
    } = {
            timeout: 5 * 6e4
        }) {
        this.pages = Array.isArray(pages) ? pages : [];
        this.timeout = Number(timeout) || 5 * 6e4;
        this.page = 0;
    }

    add(page) {
        this.pages.push(page);
        return this;
    }

    setEndPage(page) {
        if (page) this.endPage = page;
        return this;
    }

    setTransform(fn) {
        const _pages = []; 
        let i = 0;
        const ln = this.pages.length;
        for (const page of this.pages) {
            _pages.push(fn(page, i, ln));
            i++;
        }
        this.pages = _pages;
        return this;
    }

    async start(channel, buttons) {
        if (!this.pages.length) return;
        const message1 = await channel.send({
            embeds: [this.pages[0]],
            components: [buttons]
        });

    }
}