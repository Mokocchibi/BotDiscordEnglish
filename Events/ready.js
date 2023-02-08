const Discord = require("discord.js");
const loadSlashCommands = require("../Loader/loadSlashCommands");

module.exports = async Bot => {

    await loadSlashCommands(Bot);

    console.log(`${Bot.user.tag} est en ligne`);

}