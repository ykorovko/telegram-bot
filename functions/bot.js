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
});

bot.help(async (ctx) => {
  console.log("Received /help command")

  return ctx.reply('Send /authcode to receive a code')
});

const authCode = 'test'

bot.command('authcode', (ctx) => {
  console.log("Received /authcode command")

  return ctx.reply(authCode)
});

bot.command('quit', async (ctx) => {
  console.log("Received /quit command")

  try {
    await ctx.leaveChat()
  } catch(e) {
    console.error("error in quit action:", e)
    return ctx.reply("Error occured")
  }
});

bot.on('text', (ctx) => ctx.reply('👍'))

// Graceful end of the process
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

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