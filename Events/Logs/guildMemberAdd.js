const Discord = require("discord.js")
const Canvas = require('canvas')
const Event = require("../../Structure/Event")

module.exports = new Event("guildMemberAdd", async (bot, member) => {

    const db = bot.db;

    db.query(`SELECT * FROM serveur WHERE guildID = ${member.guild.id}`, async (err, req) => {

        if(req.length < 1) return;

        if(req[0].raid === "on") {

            try {
                let Embed = new Discord.MessageEmbed()
                .setColor(bot.color)
                .setTitle("Ce serveur est en mode anti-raid !")
                .setDescription(`\*Désolé, quelqu'un essaye de nous raid.\*\n\*Reviens plutard 🙃\*`)
                .setTimestamp()
                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))

                await member.user.send({embeds: [Embed]})
            } catch (err) {}
            let Embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setDescription(`\*Mode anti-raid activé !\*`)

            await member.kick({embeds: [Embed]})
        }

        if(req[0].captcha === "on") {

            let text = await bot.function.createCaptcha();

            Canvas.registerFont("./node_modules/discord-canvas-easy/Assets/futura-bold.ttf", { family: "Futura Book"})
            
            const canvas = Canvas.createCanvas(300, 150)
            const ctx = canvas.getContext("2d");

            ctx.font = '35px "Futura Book"';
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, (150 - (ctx.measureText(`${text}`).width) / 2), 85)

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("valided")
            .setLabel("Valider")
            .setEmoji("✅"))

            let msg = await bot.channels.cache.get("998640292498505789").send({content: '<@' + member.user.id + '>', files: [await canvas.toBuffer()], components: [btn]})

            let finalmessage;
            let valided = false;
            const filter = m => m.author.id === member.user.id;
            const collectorm = msg.channel.createMessageCollector({filter, time: 120000})
            const filter2 = async() => true;
            const collectorb = msg.createMessageComponentCollector({filter2, time: 120000})

            collectorm.on("collect", async message => {

                finalmessage = message.content;
            })

            collectorb.on("collect", async button => {

                let Embed1 = new Discord.MessageEmbed()
                .setColor(bot.color)
                .setDescription(`❌ \*Vous n'êtes pas l'auteur du message !\*`)  
                
                if(button.user.id !== member.user.id) return button.reply({embeds: [Embed1], ephemeral: true})

                if(finalmessage === text) {

                    valided = true;
                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        let Embed2 = new Discord.MessageEmbed()
                        .setColor(bot.color)
                        .setTitle('Captcha')
                        .setDescription(`✅ \*Vous avez réussi le captcha !\*`)
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))

                        await member.user.send({embeds: [Embed2]})
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())

                } else {

                    valided = true;
                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        let Embed3 = new Discord.MessageEmbed()
                        .setColor(bot.color)
                        .setTitle('Captcha')
                        .setDescription(`❌ \*Vous avez raté le captcha !\*`) 
                        .addField('--------------------------------------', '[Rejoindre le serveur](https://discord.gg/Xz2t3bZjVJ)')
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))
                        
                        await member.user.send({embeds: [Embed3]})
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())
                    await member.kick()
                }
            })

            collectorm.on("end", async () => {

                if(valided === false) {

                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        let Embed4 = new Discord.MessageEmbed()
                        .setColor(bot.color)
                        .setTitle('Captcha')
                        .setDescription(`❌ \*Vous n'avez pas rempli le captcha dans le temps imparti !\*`)
                        .addField('--------------------------------------', '[Rejoindre le serveur](https://discord.gg/Xz2t3bZjVJ)') 
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({dynamic: true}))
                        
                        await member.user.send({embeds: [Embed4]})
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())
                    await member.kick()
                }
            })
        }
    })
})