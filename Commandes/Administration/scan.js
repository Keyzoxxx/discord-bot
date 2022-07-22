const Discord = require("discord.js")
const Command = require("../../Structure/Command")

module.exports = new Command({

    name: "scan",
    description: "Permet savoir si un utilisateur est blacklist",
    utilisation: "[add/remove] [membre] [raison]",
    alias: ["scan"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Blacklist",

    async run(bot, message, args, db) {

      try {

          let Embed1 = new Discord.MessageEmbed()
          .setColor(bot.color)
          .setDescription(`❌ \*Aucune personne trouvée !\*`)

          let user = message.user ? await bot.users.fetch(args._hoistedOptions[0].value) : (message.mentions.users.first() || await bot.users.fetch(args[0].value));
          if(!user) return message.reply({embeds: [Embed1]})

          db.query(`SELECT * FROM blacklist WHERE ID = '${user.id} ${message.guildId}'`, async (err, req) => {

            let Embed2 = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`❌ \*Cette personne n'est pas blacklist !\*`)  
            
            if(req.length <= 0) return message.reply({embeds: [Embed2]})

              let Embed3 = new Discord.MessageEmbed()
              .setColor(bot.color)
              .setTitle(`Blacklist de ${user.tag}`)
              .setThumbnail(user.displayAvatarURL({dynamic: true}))
              .setDescription(`\*\*\*Auteur :\*\*\* \*${bot.users.cache.get(req[0].authorID)}\*\n\*\*\*Date :\*\*\* \*<t:${Math.floor(parseInt(req[0].date) / 1000)}:F>\*\n\*\*\*Raison :\*\*\* \*${req[0].reason}\*`)
              .setTimestamp()
              .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

              await message.reply({embeds: [Embed3]})
          })

      } catch (err) {

        let Embed4 = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setDescription(`❌ \*Aucune personne trouvée !\*`)

        return message.reply({embeds: [Embed4]})
      }
  }
})