import { REST, Routes } from "discord.js";
//const { REST, Routes } = require("discord.js");
import "dotenv/config";

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  {
    name: "create",
    description: "Create a new short url",
  },
];

const rest = new REST({ version: "10" }).setToken(SECRET_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
