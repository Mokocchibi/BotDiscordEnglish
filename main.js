require("dotenv").config();

const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const Bot = new Discord.Client({intents});
const loadCommands = require("./Loader/loadCommands");
const loadEvents = require("./Loader/loadEvents");

Bot.commands = new Discord.Collection();

Bot.login(process.env.TOKEN);
loadCommands(Bot);
loadEvents(Bot);