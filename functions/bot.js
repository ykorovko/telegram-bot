const { Telegraf } = require("telegraf")
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
  console.log("Received /start command")

  try {
    return ctx.reply(`Hi ${ctx.from.first_name}!`)
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
})

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting')
  ctx.reply('Send /authcode to get an auth code')
  ctx.reply('Send /quit to stop the bot')
});

const authCode = 'test'

bot.command('authcode', (ctx) => ctx.reply(authCode));

bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id)
// Context shortcut
  ctx.leaveChat()
})

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    console.log("Received an update from Telegram!", event.body)
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}