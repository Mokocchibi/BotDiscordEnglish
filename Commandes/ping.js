const Discord = require("discord.js");

module.exports = {

    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    dm: true,
    options: [],

    async run(Bot, message) {

        return await message.reply({ content: `Ping : \`${Bot.ws.ping}\``, ephemeral: true});

    }

}