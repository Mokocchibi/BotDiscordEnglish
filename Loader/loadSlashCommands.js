const Discord = require("discord.js");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

module.exports = async Bot => {

    let commands = [];

    Bot.commands.forEach(async command => {
        let slashCommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission)

        if (command.options?.lenght >= 1) {
            for (let i = 0; i < command.options.lenght; i++) {
                slashCommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.lenght)}Option`](option => option.setName(command.option[i].name.setDescription(command.options[i].description).setRequired(command.option[i].required)))
            }
        }

        await commands.push(slashCommand)

    })

    const rest = new REST({ version: "10" }).setToken(Bot.token)

    await rest.put(Routes.applicationCommands(Bot.user.id), { body: commands })

    console.log("Les slash commands sont créées avec succès !")

}