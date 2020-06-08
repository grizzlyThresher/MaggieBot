const config = require('./config/live_config.json');
const commonRules = require('./serverSpecifics/common.json');
//const customRules = require('./serverSpecifics/custom.json');
const Discord = require('discord.js');

// Grabs the bot's token from the associated config file
const token = config.token;

// Create a Client instance with our bot token.
const client = new Discord.Client();

const PREFIX = "^^";

// When the bot is connected and ready, log to console.
client.on('ready', () => {
   console.log('Connected and ready.');
   console.log("Connected as " + client.user.tag);
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

  // Switch to determine which command is being accessed
  switch (primaryCommand) {
    case "help":
      helpCommand(arguments, message);
      break;
    case "addRole":
      addRoleCommand(arguments, message);
      break;
    case "removeRole":
      removeRoleCommand(arguments, message);
      break;
    default:
      message.channel.send("I'm sorry, I don't recognize the command \"" + fullCommand + "\" :cry:\n For a list of approved commands, type: `^^help`");
  }
}

// Function used to answer questions from users about Maggie's possible commands
function helpCommand(arguments, message) {
  if (arguments.length > 0) {
    switch (arguments[0]) {
      // User asked for help with "help". Mostly here as a joke.
      case "help":
        message.channel.send("Y-You need help... with help? O-okay! `help` is a command that tells me how I can best help you! So... how can I help?");
        break;
      // User asked for help with the "addRole" command.
      case "addRole":
        let approvedRoles = ""
        commonRules.commonly_tracked_roles.forEach((role) => {
          approvedRoles += "- `" + role + "`\n";
        });
        message.channel.send("The `addRole` command allows you to assign yourself one of the following Maggie approved Roles:\n" + approvedRoles +
          "To use the `addRole` command, type: `addRole [Role name]`");
        break;
      case "removeRole":
        let userRoles = message.guild.members.cache.get(message.author.id)._roles;
        let usableRoles = "";
        let roleName;
        // Loops through the User's roles and finds the name associated with the Role Id's. Then, adds all Maggie Managed roles to a String.
        userRoles.forEach((role) => {
          roleName = message.guild.roles.cache.get(role).name;
          if (commonRules.commonly_tracked_roles.includes(roleName)) {
            usableRoles += "- `" + roleName + "`\n";
          }
        });
        message.channel.send("The `removeRole`command allows you to remove an assigned role from yourself! These are your currently assigned Roles which I am capable of removing:\n" +
          usableRoles + "To use the `removeRole` command, type: `removeRole [Role name]`");
        break;
      // User either asked for help with a nonexistant command, or made a typo.
      default:
        message.channel.send("I'm sorry, I don't recognize the command \"" + arguments[0] + "\" :cry:\n For a list of approved commands, type: `^^help`");
        break;
    }
  } else {
    message.channel.send("Here's a list of all currently approved Maggie commands:\n" +
      "`^^help` (though you probably knew that one :smile:)\n" +
      "`^^addRole [Role name]`\n" +
      "`^^removeRole [Role name]`\n" +
      "For more information about a specific command, type: `^^help [Command name]`\n\n" +
      "That's all for now but more commands are on their way, so stay tuned!");
  }
}

// Function used to handle adding Roles to a user.
function addRoleCommand(arguments, message) {
  if (arguments.length > 0) {
    let found = false;
    let roleId;
    let roleName = arguments[0];

    // Used to work with multiple word Roles, such as "[className] Expert"
    for (let i = 1; i < arguments.length; i++) {
      roleName += " " + arguments[i];
    }
      // Looks through the list of Roles in the Server to find the id of the requested Role.
      // Only works for Roles currently being tracked.
      message.guild.roles.cache.forEach((role) => {
        if (role.name === roleName && commonRules.commonly_tracked_roles.includes(roleName)) {
          roleId = role.id;
          found = true;
        }
      });
      // Either the Role doesn't exist, or it isn't a Role that is currently being tracked.
      if (found === false) {
        message.channel.send("I'm sorry, the Role of \"" + roleName + "\" either doesn't exist or I don't have the authority to give it to you :cry:\n" +
          "For a list of Maggie approved Roles, type: `^^help addRole`");
      } else {
        let userRoles = message.guild.members.cache.get(message.author.id)._roles;
        if (userRoles.includes(roleId)) {
          message.channel.send("I appreciate your interest, but it looks like you've already got the role of \"" + roleName + "\"");
        } else {
          try {
          message.guild.members.cache.get(message.author.id)
          .roles.add(roleId)
           .then(console.log)
            .catch(console.error);
          message.channel.send("Okie dokie " + message.author.toString() +"! You now have the role of \"" + roleName + "\" :partying_face:");
        } catch (DiscordAPIError) {
          message.channel.send("I'm sorry, it looks like something went wrong :cry:\n Give me some time and my dev should be able to take a look at the problem!");
        }
        }
      }
  } else {
    message.channel.send("Hey there " + message.author.toString() + ", what new Role did you want? Tell me by typing: `addRole [Role name]`\n" +
     "For a list of Maggie approved Roles, type: `^^help addRole`");
  }
}

// Function used to remove a Role from a user.
function removeRoleCommand(arguments, message) {
  if (arguments.length > 0) {
    let found = false;
    let roleId;
    let roleName = arguments[0];

    // Used to work with multiple word Roles, such as "[className] Expert"
    for (let i = 1; i < arguments.length; i++) {
      roleName += " " + arguments[i];
    }
    // Looks through the list of Roles in the Server to find the id of the requested Role.
    // Only works for Roles currently being tracked.
    message.guild.roles.cache.forEach((role) => {
      if (role.name === roleName && commonRules.commonly_tracked_roles.includes(role.name)) {
        roleId = role.id;
        found = true;
      }
    });
    // If the user has the role they asked to remove, and it's one that Maggie is responsible for, Maggie removes the role.
    // If not, she apologizes for being unable to remove it.
    if (found) {
      message.guild.members.cache.get(message.author.id)
          .roles.remove(roleId)
           .then(console.log)
            .catch(console.error);
      message.channel.send("Okie dokie " + message.author.toString() +"! You no longer have the Role of \"" + roleName + "\" :slight_smile:");
    } else {
      message.channel.send("Hey there " + message.author.toString() + ", it looks like you either don't currently have the Role of \"" +
        roleName + "\" or it's one I don't have control over. I'm sorry :cry:");
    }
  } else {
    message.channel.send("Hey there " + message.author.toString() + ", what Role did you no longer want? Tell me by typing: `removeRole [roleName]`");
  }
}