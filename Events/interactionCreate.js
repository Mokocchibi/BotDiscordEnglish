const Discord = require("discord.js");

module.exports = async (Bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = require(`../Commandes/${interaction.commandName}`)
        command.run(Bot, interaction, command.option)
    }
}