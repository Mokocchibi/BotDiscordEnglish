const Discord = require("discord.js");

module.exports = {

    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    dm: true,
    options: [],

    async run(Bot, message) {

        await message.reply(`Ping : \`${Bot.ws.ping}\``);

    }

}