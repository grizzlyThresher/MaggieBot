const config = require('./config/live_config.json');
const commonRules = require('./serverSpecifics/common.json');
const functions = require('./commands/commands.json');
//const customRules = require('./serverSpecifics/custom.json');
const Discord = require('discord.js');

// Grabs the bot's token from the associated config file
const token = config.token;

// Create a Client instance with our bot token.
const client = new Discord.Client();

const PREFIX = "^^";

let com = new Map();
const comList = functions.command_list;

// When the bot is connected and ready, log to console.
client.on('ready', () => {
   console.log('Connected and ready.');
   console.log("Connected as " + client.user.tag);

   comList.forEach((command) => {
    com.set(command, require('./commands/' + functions.commands[command].filepath));
   });

   let guilds = client.guilds.cache;
   let neededRoles = new Map();
    commonRules.commonly_tracked_roles.forEach(newRole => {
        neededRoles.set(newRole, {name:newRole, used:false});
    });
   guilds.forEach((guild) => {
   	let curRoles = neededRoles;
   	guild.roles.cache.forEach((role) => {
   		if (curRoles.has(role.name)) {
   			curRoles.set(role.name, {name:role.name, used:true});
   		}
   	});

    // Checks through all the current roles. If a role being tracked for this server does not exist, it creates the role.
   	curRoles.forEach((role) => {
   		if (!role.used) {
        if (commonRules.commonly_tracked_roles.includes(role.name)) {
          console.log("Creating " + role.name + " role in Server: " + guild.id);
          guild.roles.create(commonRules.role_info[role.name])
           .then(console.log)
            .catch(console.error);
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

  // Checks if Maggie was mentioned anywhere
  const botWasMentioned = msg.mentions.users.has(client.user.id);
  if (botWasMentioned) {
    try {
          msg.channel.send('Hi! I\'m Maggie! How can I help you? For a list of commands, type: `^^help`');
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
  if (!msg.content.startsWith(PREFIX)) {
      return;
  } else {
    processCommand(msg);
  }

});

client.on('error', err => {
   console.warn(err);
});

client.login(token);


// End of Client Listeners, beginning of Function definitions


// Function used as a hub to manage which command is being executed
function processCommand(message) {
  let fullCommand = message.content.substr(2); // The full command after the ^^ denoting a Maggie Command
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments


  // Determines which command is being requested
  if (primaryCommand === "help") {
    helpCommand(arguments, message);
  } else if (comList.includes(primaryCommand)) {
    com.get(primaryCommand).func(arguments, message);
  } else {
    message.channel.send("I'm sorry, I don't recognize the command \"" + fullCommand + "\" :cry:\n For a list of approved commands, type: `^^help`");
  }
}

// Function used to answer questions from users about Maggie's possible commands
function helpCommand(arguments, message) {
  if (arguments.length > 0) {

    if (arguments[0] === "help") {
      message.channel.send("Y-You need help... with help? O-okay! `help` is a command that tells me how I can best help you! So... how can I help?");
    } else if (comList.includes(arguments[0])) {
      com.get(arguments[0]).help(arguments, message);
    } else {
      message.channel.send("I'm sorry, I don't recognize the command \"" + arguments[0] + "\" :cry:\n For a list of approved commands, type: `^^help`");
    }
    
  } else {
    let approvedCommands = "";
    comList.forEach((command) => {
      approvedCommands += functions.commands[command].use + "\n";
    });
    message.channel.send("Here's a list of all currently approved Maggie commands:\n" +
      "`^^help` (though you probably knew that one :smile:)\n" +
      approvedCommands +
      "For more information about a specific command, type: `^^help [Command name]`\n\n" +
      "That's all for now but more commands are on their way, so stay tuned!");
  }
}