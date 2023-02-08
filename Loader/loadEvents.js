const fs = require("fs");

module.exports = async Bot => {
    fs.readdirSync("./Events").filter(f => f.endsWith(".js")).forEach(async file => {

        let event = require(`../Events/${file}`)
        Bot.on(file.split(".js").join(""), event.bind(null, Bot))

        console.log(`Évènement ${file} chargée avec succès !`)

    })
}