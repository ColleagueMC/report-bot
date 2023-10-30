const mineflayer = require('mineflayer');
const socks = require('socks').SocksClient;
const fs = require('fs');
const fetch = require('node-fetch');

const accounts = fs.readFileSync('accounts.txt', 'utf-8').split('\n');

let player = "playername";
let apiKey = "your_hypixel_api_key"; // replace with your Hypixel API key

const words = ["bhop killaura", "aimassist", "aimbot", "bunnyhopping", "timer bhop", "antikb aimbot", "velocity killaura"];

async function ignToUUID(ign) {
  const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
  const data = await response.json();
  return data.id;
}

async function getPlayerStatus(uuid, apiKey) {
  const response = await fetch(`https://api.hypixel.net/status?key=${apiKey}&uuid=${uuid}`);
  const data = await response.json();

  if (data.session.online) {
    console.log(`Player ${data.session.gameType} is playing ${data.session.mode}!`);
  } else {
    console.log('Player is offline.');
  }
}

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
    auth: 'microsoft'
  });

  bot.once('spawn', async () => {
    const uuid = await ignToUUID(player);
    await getPlayerStatus(uuid, apiKey);

    bot.chat('/play pit');


    setInterval(() => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      bot.chat(`/wdr ${player} ${randomWord}`);
    }, 60000);
  });
});
