const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { token } = require("../config")

module.exports = async(bot) => {

  const commands = [

    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Permet de connaître la latence du bot"),

    new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Permet de changer le préfixe du bot")
    .addStringOption(option => option.setName("préfixe").setDescription("Le préfixe que vous voulez").setRequired(true)),

    new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Permet de supprimer un nombre de messages")
    .addStringOption(option => option.setName("nombre").setDescription("Le nombre de messages à effacer").setRequired(true)),

    new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Permet de connaître l'expérience d'un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre où vous voulez l'expérience").setRequired(false)),

    new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Permet de connaître les 10 utilisateurs avec le plus d'expérience"),

    new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Permet de bannir définitivement un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à bannir").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du bannissement").setRequired(false)),

    new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Permet d'expulser un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à expulser").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison de l'expulsion").setRequired(false)),

    new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Permet de redémarrer le bot"),

    new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Permet de stopper le bot"),

    new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Permet d'évaluer un code")
    .addStringOption(option => option.setName("code").setDescription("Le code à évaluer").setRequired(true)),

    new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Permet de recharger une commande")
    .addStringOption(option => option.setName("commande").setDescription("La commande à recharger").setRequired(true)),

    new SlashCommandBuilder()
    .setName("help")
    .setDescription("Permet de connaître toutes les commandes du bot")
    .addStringOption(option => option.setName("commande").setDescription("La commande où vous voulez les informations").setRequired(false)),

    new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Permet d'avertir un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à avertir").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison de l'avertissement").setRequired(false)),

    new SlashCommandBuilder()
    .setName("antiraid")
    .setDescription("Permet d'activer ou de désactiver l'anti-raid")
    .addStringOption(option => option.setName("état").setDescription("L'état de l'anti-raid").setRequired(true)),
    
    new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Permet de supprimer le dernier avertissement reçu par un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à qui supprimer l'avertissement").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison de la suppression").setRequired(false)),

    new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Permet de bannir temporairement un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à bannir temporairement").setRequired(true))
    .addStringOption(option => option.setName("temps").setDescription("Le temps du bannissement").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du bannissement temporaire").setRequired(false)),

    new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Permet de débannir un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à débannir").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du débannissement").setRequired(false)),

    new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Permet de rendre temporairement muet un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à rendre muet").setRequired(true))
    .addStringOption(option => option.setName("temps").setDescription("Le temps du muet").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du muet").setRequired(false)),

    new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Permet de rendre la parole d'un utilisateur")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à rendre la parole").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du rendu de parole").setRequired(false)),

    new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Permet de locker un salon")
    .addChannelOption(option => option.setName("salon").setDescription("Le salon à locker").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du lock").setRequired(false)),

    new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Permet de unlocker un salon")
    .addChannelOption(option => option.setName("salon").setDescription("Le salon à un locker").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du unlock").setRequired(false)),

    new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Permet d'ajouter ou de retirer un utilisateur de la blacklist")
    .addStringOption(option => option.setName("choix").setDescription("Le choix de la blacklist").setRequired(true).addChoices({name: "add", value: "add"}, {name: "remove", value: "remove"}))
    .addUserOption(option => option.setName("membre").setDescription("Le membre à blacklist").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison du blacklist").setRequired(true)),

    new SlashCommandBuilder()
    .setName("scan")
    .setDescription("Permet de savoir si un utilisateur est blacklist")
    .addUserOption(option => option.setName("membre").setDescription("Le membre à observer").setRequired(true)),

    new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Permet d'activer ou de désactiver le captcha")
    .addStringOption(option => option.setName("état").setDescription("L'état du captcha").setRequired(true)),

    new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Permet de connaître le dernier message supprimé du salon"),
]
  
  const rest = new REST({ version: "9" }).setToken(token);

  bot.guilds.cache.forEach(async guild => {

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), { body: commands });
  })

  console.log(`
  ╔═════════════════════════════╗
  ║  Les slashs commandes ont   ║
  ║   été créées avec succès    ║
  ╚═════════════════════════════╝`)
}  