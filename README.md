# Revolt Modmail
The first Modmail bot that is made in Revolt. It provides features such as snippets, subbing to threads (pinged on every message), blocking/unblocking users, and displaying logs for each thread.

## 🚧 Procedures

- [Node.js 14+](https://nodejs.org/en/download/)
- Edit `config.js` and provide the necessary IDs
- Add MongoDB uri & Revolt bot token in `botconfig.json`
- Run `npm i` which will download all necessary packages
- Run the bot; Either use Node or PM2 (Process Manager 2)
  - `node index.js`
  - `pm2 start index.js --name Modmail`
    - Download: `npm i pm2@latest -g`

## 🖥️ Screenshots

- Account Information
<img src="/assets/Account.png">

- Blocking Users
<img src="/assets/Blocked.png">

- Closing Threads
<img src="/assets/Closed.png">

- Help Menu
<img src="/assets/Help.png">

- Display Logs
<img src="/assets/Logs.png">

- Sending Messages
<img src="/assets/Sending.png">

- Snippets
<img src="/assets/Snippets.png">

- Starting a Thread
<img src="/assets/Start.png">
