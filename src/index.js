const config = require('./config/config.json');
const Discord = require('discord.js')


// Grabs the bot's token from the associated config file
const token = config.token;

// Create a Client instance with our bot token.
const client = new Discord.Client();

const PREFIX = "^^";



// Used to keep track of available roles
const globallyTrackedRoles = ['Hunter','Fighter', 'Ranger', 'Gunner', 'Force', 'Techer', 'Braver', 'Bouncer', 'Summoner'];



// When the bot is connected and ready, log to console.
client.on('ready', () => {
   console.log('Connected and ready.');
   console.log("Connected as " + client.user.tag);
   let guilds = client.guilds.cache;
   let neededRoles = new Map();
    globallyTrackedRoles.forEach(newRole => {
        neededRoles.set(newRole, {name:newRole, used:false});
    });
   guilds.forEach((guild) => {
   	let curRoles = neededRoles;
//   	console.log(curRoles);
   	guild.roles.cache.forEach((role) => {
   		if (curRoles.has(role.name)) {
   			curRoles.set(role.name, {name:role.name, used:true});
   		}
   	});
    // Checks through all the current roles. If it does not exist, it creates the role.
   	curRoles.forEach((role) => {
   		if (!role.used) {
   			console.log(role);
        switch (role.name) {
          case "Hunter":
              console.log("Creating Hunter role.");
              guild.roles.create({
                  data: {
                    name: 'Hunter',
                    color: '0x7f1510',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Hunter',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Fighter":
              console.log("Creating Fighter role.");
              guild.roles.create({
                  data: {
                    name: 'Fighter',
                    color: '0x9a2c75',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Fighter',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Ranger":
              console.log("Creating Ranger role.");
              guild.roles.create({
                  data: {
                    name: 'Ranger',
                    color: '0x1c3298',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Ranger',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Gunner":
              console.log("Creating Gunner role.");
              guild.roles.create({
                  data: {
                    name: 'Gunner',
                    color: '0x2183bd',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Gunner',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Force":
              console.log("Creating Force role.");
              guild.roles.create({
                  data: {
                    name: 'Force',
                    color: '0xb6b936',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Force',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Techer":
              console.log("Creating Techer role.");
              guild.roles.create({
                  data: {
                    name: 'Techer',
                    color: '0x8d6309',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Techer',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Bouncer":
              console.log("Creating Bouncer role.");
              guild.roles.create({
                  data: {
                    name: 'Bouncer',
                    color: '0x7aae09',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Bouncer',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Braver":
              console.log("Creating Braver role.");
              guild.roles.create({
                  data: {
                    name: 'Braver',
                    color: '0x008f29',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Braver',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "Summoner":
              console.log("Creating Summoner role.");
              guild.roles.create({
                  data: {
                    name: 'Summoner',
                    color: '0xd92667',
                    mentionable: false
                  },
                  reason: 'Keep track of who plays Summoner',
              })
                .then(console.log)
                .catch(console.error);
              break;
          case "test":
              console.log("Creating test role.");
              // Create a new role with data and a reason
              guild.roles.create({
                  data: {
                    name: 'test',
                    color: '0x0000ff',
                    mentionable: true
                  },
                  reason: 'role to test role addition',
              })
                .then(console.log)
                .catch(console.error);
              break;
          default:
              console.log(`Will add ${role.name} to roles soon.`);
              break;
        }
   		}
   	});
   });   

});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
client.on('message', async (msg) => {

  // Maggie shouldn't talk to herself, that's just rude.
  if (msg.author === client.user) {
    return;
  }

  const content = msg.content;

    console.log(msg.mentions.users.has(client.user.id));
   const botWasMentioned = msg.mentions.users.has(client.user.id);
   if (botWasMentioned) {
       try {
           msg.channel.send('Hi! I\'m Maggie! How can I help you? For a list of commands, type ^^help');
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