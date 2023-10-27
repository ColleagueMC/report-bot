```js

const mineflayer = require('mineflayer');
const socks = require('socks').SocksClient;
const fs = require('fs');



const accounts = fs.readFileSync('accounts.txt', 'utf-8').split('\n');

let player = "playername";

const words = ["bhop killaura", "aimassist", "aimbot", "bunnyhopping", "timer bhop", "antikb aimbot", "velocity killaura"];


accounts.forEach(account => {
  const [login, proxy] = account.split('@');
  const [email, password] = login.split(':');
  const [ip, port] = proxy.split(':');


  const bot = mineflayer.createBot({
    connect: bot => {
      socks.createConnection({
        proxy: {
          host: ip,
          port: parseInt(port),
          type: 5
        },
        command: 'connect',
        destination: {
          host: 'hypixel.net',
          port: 25655
          auth: 'microsoft'
        }
      }, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        bot.setSocket(info.socket);
        bot.emit('connect');
      });
    },
    username: email,
    password: password,
  });

  setInterval(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    bot.chat(`/wdr ${player} ${randomWord}`);
  }, 60000);
});```
