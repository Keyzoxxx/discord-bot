const Discord = require("discord.js")
const Command = require("../../Structure/Command")

module.exports = new Command({

    name: "captcha",
    description: "Permet d'activer ou de désactiver le captcha",
    utilisation: "[on/off]",
    alias: ["captcha"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Administration",

    async run(bot, message, args, db) {

        let Embed1 = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setDescription(`❌ \*Veuillez indiquer\* \`on\` \*ou\* \`off\` \*!\*`)

        let Embed2 = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setDescription(`❌ \*Veuillez indiquer\* \`on\` \*ou\* \`off\` \*!\*`)

        let choix = message.user ? args._hoistedOptions[0].value : args[0]
        if(!choix) return message.reply({embeds: [Embed1]})
        if(choix !== "on" && choix !== "off") return message.reply({embeds: [Embed2]})

        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, req) => {

            let Embed3 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Ce serveur n'est pas encore enregistré !\*`)

            let Embed4 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Le captcha est déjà ${choix === "on" ? "activé" : "désactivé"} !\*`)

            if(req.length < 1) return message.reply({embeds: [Embed3]})
            if(req[0].captcha === choix) return message.reply({embeds: [Embed4]})

            db.query(`UPDATE serveur SET captcha = '${choix}' WHERE guildID = ${message.guildId}`)

            let Embed5 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`✅ \*Le captcha a été ${choix === "on" ? "activé" : "désactivé"} !\*`)

            message.reply({embeds: [Embed5]})
        })
    }
})