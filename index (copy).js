const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');  // Note: Replace with the correct library if available

const API_TG = process.env['YOUR_TELEGRAM_BOT_TOKEN']
const bot = new Telegraf(API_TG);  // Replace with your actual bot token

const MODEL_NAME = 'gemini-pro';
const API_KEY = process.env['API_KEY'];

const genAI = new GoogleGenerativeAI(API_KEY);  // Replace with the correct initialization if available
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

bot.start((ctx) => ctx.reply('Welcome!'));

bot.on('text', async (ctx) => {
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(ctx.message.text);
  const response = result.response;

  ctx.reply(response.text());
});

bot.launch();
