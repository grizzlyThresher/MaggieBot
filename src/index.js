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
        globallyTrackedRoles.forEach((role) => {
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
          if (globallyTrackedRoles.includes(roleName)) {
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
        if (role.name === roleName && globallyTrackedRoles.includes(role.name)) {
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
          message.guild.members.cache.get(message.author.id)
          .roles.add(roleId)
           .then(console.log)
           .catch(console.error);
          message.channel.send("Okie dokie " + message.author.toString() +"! You now have the role of \"" + roleName + "\" :partying_face:");
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
      if (role.name === roleName && globallyTrackedRoles.includes(role.name)) {
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