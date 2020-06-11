// Command used to remove a Role from a user.

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
  },
  help: function(arguments, message) {
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
  }
}