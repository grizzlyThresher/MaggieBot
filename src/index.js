const config = require('./config/config.json');
const Discord = require('discord.js')


// Grabs the bot's token from the associated config file
const token = config.token;

// Create a Client instance with our bot token.
const client = new Discord.Client();

const PREFIX = "+maggie";

// Used to keep track of available roles




// When the bot is connected and ready, log to console.
client.on('ready', () => {
   console.log('Connected and ready.');
   console.log("Connected as " + client.user.tag);
   let guilds = client.guilds.cache;
   let neededRoles = new Map();
    neededRoles.set('Fighter', {name:'Fighter', used:false});
   guilds.forEach((guild) => {
   	let curRoles = neededRoles;
//   	console.log(curRoles);
   	guild.roles.cache.forEach((role) => {
   		if (curRoles.has(role.name)) {
   			curRoles.set(role.name, {name:role.name, used:true});
   		}
   		console.log(curRoles.has(role.name));
   		console.log(role.name);
   	});
   	curRoles.forEach((role) => {
   		if (!role.used) {
   			console.log(role);
   		}
   	});
   });   

});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
client.on('messageCreate', async (msg) => {

  const content = msg.content;


   const botWasMentioned = msg.mentions.find(
       mentionedUser => mentionedUser.id === client.user.id
   );
   if (botWasMentioned) {
       try {
           await msg.channel.createMessage('Hi! I\'m Maggie! How can I help you?');
       } catch (err) {
           // There are various reasons why sending a message may fail.
           // The API might time out or choke and return a 5xx status,
           // or the bot may not have permission to send the
           // message (403 status).
           console.warn('Failed to respond to mention.');
           console.warn(err);
       }
   }

   // Ignore any message that doesn't start with the correct prefix.
  if (!content.startsWith(PREFIX)) {
      return;
  }

  const mentioned = msg.mentions;
  console.log(mentioned);


});

client.on('error', err => {
   console.warn(err);
});

client.login(token);