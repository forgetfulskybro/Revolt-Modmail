class Embed {
    url = null;
    title = null;
    description = null;
    image = null;
    icon_url = null;
    color = null;
    thumbnail = null;

    constructor(data) {
        Object.assign(this, data)
    }

    setTitle(title) {
        this.title = title
        return this
    }

    setIcon(iconURL) {
        this.icon_url = iconURL
        return this
    }

    setColor(color) {
        this.color = color
        return this
    }

    setImage(image) {
        this.image = image
        return this
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail
        return this
    }

    setDescription(description) {
        this.description = description
        return this
    } 

    setURL(url) {
        this.url = url
        return this
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            url: this.url,
            icon_url: this.icon_url,
            image: this.image,
            thumbnail: this.thumbnail,
            colour: this.color
        }
    }
}

module.exports = Embed;