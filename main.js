require("dotenv").config();

const Discord = require("discord.js");
const Bot = new Discord.Client({intents: 3276799});

Bot.login(process.env.TOKEN)

Bot.on("ready", async () => {
    console.log(`${Bot.user.tag} est en ligne`)
})