const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
	console.log(`Sombra Online. What do you need from me now?`);

	bot.user.setActivity(`Overwatch`);

	try {
		let link = await bot.generateInvite(["MANAGE_MESSAGES", "MOVE_MEMBERS"]);
		console.log(link);
	} catch(e) {
		console.log(e.stack);
	}
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if(command === `${prefix}userinfo`) {
		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.username, message.author.avatarURL)
			.setDescription(`Below is the details of ${message.author.username}`)
			.setColor("#9932CC")
			.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/SombraASCIISkull.svg/220px-SombraASCIISkull.svg.png")
			.addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
			.addField("ID", message.author.id)
			.addField("Created At", message.author.createdAt)
			.setImage(message.author.avatarURL);

		message.channel.sendEmbed(embed);

		return;
	}

	if(command === `${prefix}mute`) {
		if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("You don't have the right to shut them up.");

		let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if(!toMute) return message.channel.sendMessage("You did not specify a user mention!");


		let role = message.guild.roles.find (r => r.name === "Sombra Muted");
		if(!role) {
			try {
				role = await message.guild.createRole({
					name: "Sombra Muted",
					color: "#000000",
					permissions: []
				});

				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(role, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false
					});
				})
			} catch(e) {
				console.log(e.stack)
			}
		}
		
		if(toMute.roles.has(role.id)) return message.channel.sendMessage("This user is already muted!");

		await toMute.addRole(role)
		message.channel.sendMessage("I have muted them!");

		return;

		//Check is the command executor has the right permission to do this command
		//if the mutee has the same or a higher rank than the muter, then return
	}

	if(command === `${prefix}unmute`) {
		if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("You don't have the right to shut them up.");

		//Get the mentioned user, return if there is none
		let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if(!toMute) return message.channel.sendMessage("Could you actually mention them, cabron?");

		let role = message.guild.roles.find (r => r.name === "Sombra Muted");
		
		if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("This user is not muted")

		await toMute.removeRole(role)
		message.channel.sendMessage("I have unmuted them!");

		return;

		//Check is the command executor has the right permission to do this command
		//if the mutee has the same or a higher rank than the muter, then return

	}
	
	if(command === `${prefix}KeyMe`) {
		message.member.addRole('407239446778609664');
		return;
	}

	if(command === "Test") {
		if (message.member.voicechannel = '407142684160163844') return message.member.setVoiceChannel('407239632640540687');
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")});                        
		
		return;
	}

	if(command === "Tempora") {
			message.member.setVoiceChannel('405277814309519371');
	            message.channel.fetchMessages()
	               .then(function(list){
	                    message.channel.bulkDelete(list);
	                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")});                        
			
			return;
		}

});

bot.login(botSettings.token);
