const { Telegraf } = require("telegraf");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai"); // Note: Replace with the correct library if available

const API_TG = process.env["YOUR_TELEGRAM_BOT_TOKEN"];
const bot = new Telegraf(API_TG); // Replace with your actual bot token

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env["API_KEY"];

const genAI = new GoogleGenerativeAI(API_KEY); // Gantilah dengan inisialisasi yang sesuai jika ada
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 4048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

async function sendWithTypingAnimation(ctx, text) {
  await ctx.telegram.sendChatAction(ctx.chat.id, "typing");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await ctx.reply(text);
}

bot.start((ctx) => ctx.reply("Welcome!"));

bot.on("text", async (ctx) => {
  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(ctx.message.text);
    const response = result.response;

    await sendWithTypingAnimation(ctx, response.text());
  } catch (error) {
    console.error("An error occurred:", error);

    // Restart the bot or take appropriate actions here
    // You might want to use process.exit() or other restart mechanisms
    // For simplicity, let's restart the bot using Telegraf's stop() and launch() methods
    await ctx.reply("An error occurred. Restarting...");
    await bot.stop();
    bot.launch();
  }
});

bot.launch();
