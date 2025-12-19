import { Client, GatewayIntentBits } from "discord.js";
//const { Client, GatewayIntentBits } = require("discord.js");
import { conMongoDB } from "./connection.js";

//import crypto from "crypto";
import { nanoid } from "nanoid";
import { Url } from "./model.js";
//import("dotenv").config();
import "dotenv/config";

import { getAIResponse } from "./openai.js";

//console.log(process.env.SECRET_TOKEN);
//console.log(process.env.CLIENT_ID);

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

conMongoDB(MONGODB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Not Connected", err);
  });

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("create ")) {
    const originalUrl = message.content.split("create ")[1];

    const shortId = nanoid(7);

    await Url.create({
      shortId,
      originalUrl,
    });

    return message.reply(`Short URL created:\n${shortId}`);
  }

  // AI Chatbot response
  try {
    const aiReply = await getAIResponse(message.content);
    await message.reply(aiReply);
  } catch (err) {
    console.error(err);
    message.reply("AI is busy right now. Try again later.");
  }

  //console.log(message.content);
  //console.log(message);
  if (message.author.bot) return;
  message.reply({
    content: "Hi From Bot",
  });
});

client.on("interactionCreate", (interaction) => {
  //console.log(interaction);
  interaction.reply("Pong!!");
});

client.login(SECRET_TOKEN);

// const secret = crypto.randomBytes(32).toString("hex");
// console.log(secret);
