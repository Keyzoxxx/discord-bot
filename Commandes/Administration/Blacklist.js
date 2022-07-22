const Discord = require("discord.js")
const Command = require("../../Structure/Command")

module.exports = new Command({

    name: "blacklist",
    description: "Permet d'ajouter ou de retirer un utilisateur de la blacklist",
    utilisation: "[add/remove] [membre] [raison]",
    alias: ["blacklist", "bl"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Blacklist",

    async run(bot, message, args, db) {

        let Embed1 = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setDescription(`❌ \*Veuillez indiquer\* \`add\` \*ou\* \`remove\` \*!\*`)

        let Embed2 = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setDescription(`❌ \*Veuillez indiquer\* \`add\` \*ou\* \`remove\` \*!\*`)
      
        let choice = message.user ? args._hoistedOptions[0].value : args[0]
        if(!choice) return message.reply({embeds: [Embed1]})
        if(choice !== "add" && choice !== "remove") return message.reply({embeds: [Embed2]})

        try {

            let Embed3 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Aucune personne trouvée !\*`)
            
            let Embed4 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Veuillez indiquer une raison !\*`)
            
            let user = message.user ? await bot.users.fetch(args._hoistedOptions[1].value) : (message.mentions.users.first() || await bot.users.fetch(args[0]))
            if(!user) return message.reply({embeds: [Embed3]})

            let reason = message.user ? args._hoistedOptions[2].value : args.slice(2).join(" ")
            if(!reason) return message.reply({embeds: [Embed4]})

            if(choice === "add") {

                db.query(`SELECT * FROM blacklist WHERE ID = '${user.id} ${message.guildId}'`, async (err, req) => {

                    let Embed5 = new Discord.MessageEmbed()
                    .setColor(bot.color)
                    .setDescription(`❌ \*Cette personne est déjà blacklist !\*`)

                    if(req.length >= 1) return message.reply({embeds: [Embed5]})

                    let sql = `INSERT INTO blacklist (ID, userID, guildID, authorID, reason, date) VALUES ('${user.id} ${message.guildId}', '${user.id}', '${message.guildId}', '${message.user ? message.user.id : message.author.id}', '${reason}', '${Date.now()}')`
                    db.query(sql, function(err) {
                        if(err) throw err;
                    })

                    let Embed6 = new Discord.MessageEmbed()
                    .setColor(bot.color)
                    .setTitle("Blacklist")
                    .setDescription(`\*${user.tag} a été blacklisté par ${message.user ? message.user : message.author}.\*\n\n\*\*Raison :\*\* \*${reason}.\*`)
                    .setTimestamp()
                    .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))

                    await message.reply({embeds: [Embed6]})
                    try {
                      let Embed7 = new Discord.MessageEmbed()
                      .setColor(bot.color)
                      .setTitle("Blacklist")
                      .setDescription(`\*Vous avez été blacklisté du serveur \_\_${message.guild.name}\_\_ par \_\_${message.user ? message.user.tag : message.author.tag}\_\_.\*\n\n\*\*Raison :\*\* \*${reason}.\*`)
                      .setTimestamp()
                      .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))  
                      
                      await user.send({embeds: [Embed7]})
                    } catch (err) {}

                    await message.guild.bans.create(user, {reason: reason})
                })
            }

            if(choice === "remove") {

                db.query(`SELECT * FROM blacklist WHERE ID = '${user.id} ${message.guildId}'`, async (err, req) => {

                    let Embed14 = new Discord.MessageEmbed()
                    .setColor(bot.color)
                    .setDescription("❌ \*Cette personne n'est pas blacklist !\*")
                    
                    if(req.length <= 0) return message.reply({embeds: [Embed14]})

                    db.query(`DELETE FROM blacklist WHERE ID = '${user.id} ${message.guildId}'`)

                    let Embed8 = new Discord.MessageEmbed()
                    .setColor(bot.color)
                    .setTitle("Blacklist")
                    .setDescription(`\*${user.tag} a été enlevé de la blacklisté par ${message.user ? message.user : message.author}.\*\n\n\*\*Raison :\*\* \*${reason}.\*`)
                    .setTimestamp()
                    .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))

                    await message.reply({embeds: [Embed8]})
                    try {
                        let Embed9 = new Discord.MessageEmbed()
                      .setColor(bot.color)
                      .setTitle("Blacklist")
                      .setDescription(`\*Vous avez été retiré de la blacklist du serveur \_\_${message.guild.name}\_\_ par \_\_${message.user ? message.user.tag : message.author.tag}\_\_.\*\n\n\*\*Raison :\*\* \*${reason}.\*`)
                      .setTimestamp()
                      .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))   
                      
                      await user.send({embeds: [Embed9]})
                    } catch (err) {}

                    await message.guild.members.unban(user, reason)
                })
            }

        } catch (err) {

            let Embed10 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Aucune personne trouvée !\*`)

            return message.reply({embeds: [Embed10]})
        }
    }
})