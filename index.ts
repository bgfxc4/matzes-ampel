import * as Discord from "discord.js";
import * as fs from "fs";
import express from "express"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf8"));

var cam_active = false


const app = express()

app.get("/cam-status", (req, res) => {
	if (cam_active)
		res.send(`1 The cam of the user with the ID ${config.monitored_user} is currently active.`)
	else 
		res.send(`0 The cam of the user with the ID ${config.monitored_user} is currently not active.`)
})

app.listen(config.express_port, () => {
	console.log(`[server]: Server is running at https://localhost:${config.express_port}`)	
})



var client = new Discord.Client();

client.on("ready", () => {
    console.log("[Discord.js] Logged in as " + client.user?.username + "...");
	check_for_webcam()
});


client.on("message", (msg) => {
    if (!msg.guild) return;
    if (msg.member?.id == client.user?.id) return;

    var cont = msg.content;
    var author = msg.member;

    try {
        if (author?.id != null && client.user?.id != null) {
            if (author.id != client.user.id && cont.startsWith(config.prefix)) {

            }
        }
    } catch (err) {
        console.log(err, msg);
    }
});

function check_for_webcam() {
	var guilds = client.guilds.cache.array()
	for (var i in guilds) {
		var channels = guilds[i].channels.cache.array()
		for (var j in channels) {
			var members = channels[j].members.array()
			for (var k in members) {
				if (members[k].id == config.monitored_user && members[k].voice.selfVideo) {
					cam_active = true
					setTimeout(check_for_webcam, 3000)
					return
				}
			}
		}
	}
	cam_active = false
	setTimeout(check_for_webcam, 3000)
}

client.login(config.token);
