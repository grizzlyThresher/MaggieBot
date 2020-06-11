// Command used to handle adding Roles to a user.

const commonRules = require('../../serverSpecifics/common.json');

module.exports = {
	func: function(arguments, message) {
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
	},
	help: function(arguments, message) {
    let approvedRoles = ""
    commonRules.commonly_tracked_roles.forEach((role) => {
      approvedRoles += "- `" + role + "`\n";
    });
    message.channel.send("The `addRole` command allows you to assign yourself one of the following Maggie approved Roles:\n" + approvedRoles +
     "To use the `addRole` command, type: `addRole [Role name]`");
	}
}