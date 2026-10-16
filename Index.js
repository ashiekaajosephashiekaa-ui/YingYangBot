'use strict';

/**
 * YingYangGOD☯️ — Official Telegram Bot
 * ---------------------------------------------------------------
 * Stack : Node.js + Telegraf (long polling)
 * Host  : Railway
 * Repo  : GitHub
 * Env   : BOT_TOKEN (required)
 * ---------------------------------------------------------------
 * No database. No webhook. No external backend. No third-party APIs.
 * ---------------------------------------------------------------
 */

const { Telegraf, Markup } = require('telegraf');

/* ============================================================
 * 1. ENVIRONMENT / CONFIG
 * ============================================================ */

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  // Never print the token itself — only report that it is missing.
  console.error('[FATAL] BOT_TOKEN environment variable is not set. Aborting startup.');
  process.exit(1);
}

/* ============================================================
 * 2. OFFICIAL PROJECT DATA (do not modify)
 * ============================================================ */

const LINKS = {
  community1: 'https://t.me/+_61PBUqa6JQ1OTg9',
  community2: 'https://t.me/+BG5_pIkPOANkZDU1',
  channel: 'https://t.me/YingYangGOD',
  token: 'https://phantom.app/tokens/solana/8q4c4ycdE',
  website: 'https://linktr.ee/YingYangGOD',
};

const CONTRACT_ADDRESS = '8q4c4ycdEZMjcYxUgo9SacDLq172tSHSNeRSXY9Mpump';

const CALLBACK = {
  showContract: 'show_contract_address',
};

/* ============================================================
 * 3. MESSAGE TEMPLATES
 * ============================================================ */

const MSG = {
  welcome: [
    '☯️ Welcome to YingYangGOD',
    '',
    'Welcome to the official YingYangGOD community hub.',
    '',
    'Connect with our community, follow official updates, explore our website, and access token information through the links below.',
    '',
    'Choose an option to continue.',
    '',
    'Please verify all token details carefully before making any transaction. This bot does not provide financial advice.',
  ].join('\n'),

  community: [
    '☯️ <b>YingYangGOD Community</b>',
    '',
    'Join our official community groups and follow the official channel for updates.',
    '',
    'Select an option below to continue.',
  ].join('\n'),

  token: [
    '🪙 <b>YingYangGOD Token Information</b>',
    '',
    'Explore the token information using the official token page below.',
    '',
    'Contract Address:',
    CONTRACT_ADDRESS,
    '',
    'Always verify the contract address before interacting with a token.',
  ].join('\n'),

  website: [
    '🌐 <b>Official Website</b>',
    '',
    'Open the official YingYangGOD website using the button below.',
  ].join('\n'),

  help: [
    '☯️ <b>YingYangGOD Bot — Help</b>',
    '',
    'Available commands:',
    '',
    '/start — Main menu and official links',
    '/community — Community groups and official channel',
    '/token — Token information and contract address',
    '/website — Official website link',
    '/help — This help message',
    '',
    'Tap any button below a message to open an official link or display the contract address.',
    '',
    'This bot does not provide financial advice. Always verify token details before making any transaction.',
  ].join('\n'),

  contract: [
    '📋 <b>Official Contract Address</b>',
    '',
    `<code>${CONTRACT_ADDRESS}</code>`,
    '',
    'Tap the address above to copy it.',
    '',
    'Always verify the contract address before interacting with a token. This bot does not provide financial advice.',
  ].join('\n'),

  fallback: [
    '☯️ I did not recognize that request.',
    '',
    'Use /help to see the available commands, or tap a button below a previous message.',
  ].join('\n'),
};

/* ============================================================
 * 4. KEYBOARD BUILDERS
 * ============================================================ */

/**
 * Shared "Buy" button.
 * Uses a Telegram inline URL button (NOT a callback) that opens the
 * official Phantom token page directly.
 * The URL is the official token page — it is intentionally NOT
 * labeled as Pump.fun because no official Pump.fun link was supplied.
 */
function buyButton() {
  return Markup.button.url('🛒 Buy YingYangGOD ☯️', LINKS.token);
}

function mainMenuKeyboard() {
  return Markup.inlineKeyboard([
    // Prominent BUY button at the top of the main menu.
    [buyButton()],
    [Markup.button.url('☯️ Community Chat 1', LINKS.community1)],
    [Markup.button.url('☯️ Community Chat 2', LINKS.community2)],
    [Markup.button.url('📢 Official Telegram Channel', LINKS.channel)],
    [Markup.button.url('🪙 Token Information', LINKS.token)],
    [Markup.button.url('🌐 Official Website', LINKS.website)],
    [Markup.button.callback('📋 Show Contract Address', CALLBACK.showContract)],
  ]);
}

function communityKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url('☯️ Community Chat 1', LINKS.community1)],
    [Markup.button.url('☯️ Community Chat 2', LINKS.community2)],
    [Markup.button.url('📢 Official Telegram Channel', LINKS.channel)],
    [Markup.button.url('🌐 Official Website', LINKS.website)],
  ]);
}

function tokenKeyboard() {
  return Markup.inlineKeyboard([
    // Prominent BUY button at the top of the token menu.
    [buyButton()],
    [Markup.button.url('🪙 View Token on Phantom', LINKS.token)],
    [Markup.button.callback('📋 Show Contract Address', CALLBACK.showContract)],
  ]);
}

function websiteKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url('🌐 Open Official Website', LINKS.website)],
    [Markup.button.url('📢 Official Telegram Channel', LINKS.channel)],
  ]);
}

function helpKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.url('☯️ Community Chat 1', LINKS.community1)],
    [Markup.button.url('📢 Official Telegram Channel', LINKS.channel)],
    [Markup.button.url('🪙 Token Information', LINKS.token)],
  ]);
}

/* ============================================================
 * 5. BOT INITIALISATION
 * ============================================================ */

const bot = new Telegraf(BOT_TOKEN);

/* ============================================================
 * 6. COMMANDS
 * ============================================================ */

// /start — main welcome message and menu (includes prominent BUY button)
bot.start(async (ctx) => {
  await ctx.reply(MSG.welcome, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...mainMenuKeyboard(),
  });
});

// /community — both community groups + official channel
bot.command('community', async (ctx) => {
  await ctx.reply(MSG.community, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...communityKeyboard(),
  });
});

// /token — token information, Phantom link, contract address (includes BUY button)
bot.command('token', async (ctx) => {
  await ctx.reply(MSG.token, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...tokenKeyboard(),
  });
});

// /website — official website link
bot.command('website', async (ctx) => {
  await ctx.reply(MSG.website, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...websiteKeyboard(),
  });
});

// /help — concise command list
bot.command('help', async (ctx) => {
  await ctx.reply(MSG.help, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...helpKeyboard(),
  });
});

/* ============================================================
 * 7. CALLBACK QUERIES
 * ============================================================ */

// "Show Contract Address" — sends the contract address in a separate message
bot.action(CALLBACK.showContract, async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (err) {
    // A stale callback query is harmless — keep going.
    console.warn('[WARN] answerCbQuery failed:', err && err.message ? err.message : err);
  }

  try {
    await ctx.reply(MSG.contract, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        [Markup.button.url('🪙 View Token on Phantom', LINKS.token)],
        [Markup.button.url('🌐 Official Website', LINKS.website)],
      ]),
    });
  } catch (err) {
    console.error('[ERROR] Failed to send contract address:', err && err.message ? err.message : err);
  }
});

// Any other / unknown callback button — answer politely so the spinner stops.
bot.on('callback_query', async (ctx) => {
  try {
    await ctx.answerCbQuery('This action is no longer available.');
  } catch (err) {
    console.warn('[WARN] answerCbQuery (fallback) failed:', err && err.message ? err.message : err);
  }
});

/* ============================================================
 * 8. FALLBACK FOR UNRECOGNISED TEXT / COMMANDS
 * ============================================================ */

bot.on('text', async (ctx) => {
  try {
    await ctx.reply(MSG.fallback, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📋 Show Contract Address', CALLBACK.showContract)],
        [Markup.button.url('☯️ Community Chat 1', LINKS.community1)],
      ]),
    });
  } catch (err) {
    console.error('[ERROR] Fallback reply failed:', err && err.message ? err.message : err);
  }
});

/* ============================================================
 * 9. GLOBAL ERROR HANDLER
 * ============================================================ */

bot.catch((err, ctx) => {
  const updateType = ctx && ctx.updateType ? ctx.updateType : 'unknown';
  console.error(`[ERROR] Telegraf caught an error on update type "${updateType}":`,
    err && err.message ? err.message : err);
});

/* ============================================================
 * 10. PROCESS-LEVEL SAFETY NETS
 * ============================================================ */

process.on('unhandledRejection', (reason) => {
  console.error('[WARN] Unhandled promise rejection:', reason && reason.message ? reason.message : reason);
});

process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught exception:', err && err.message ? err.message : err);
});

/* ============================================================
 * 11. STARTUP + GRACEFUL SHUTDOWN
 * ============================================================ */

async function registerCommands() {
  try {
    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Main menu and official links' },
      { command: 'community', description: 'Community groups and official channel' },
      { command: 'token', description: 'Token information and contract address' },
      { command: 'website', description: 'Official website link' },
      { command: 'help', description: 'How to use this bot' },
    ]);
    console.log('[INFO] Bot commands registered with Telegram.');
  } catch (err) {
    console.warn('[WARN] Could not register bot commands:', err && err.message ? err.message : err);
  }
}

async function startBot() {
  await registerCommands();

  // Long polling — no webhook, no custom domain, no web server required.
  await bot.launch();

  const me = bot.botInfo || {};
  console.log(`[INFO] YingYangGOD bot is running (long polling). Username: @${me.username || 'unknown'}`);
}

startBot().catch((err) => {
  console.error('[FATAL] Failed to start the bot:', err && err.message ? err.message : err);
  process.exit(1);
});

// Railway sends SIGTERM on redeploy/shutdown — stop the bot cleanly.
process.once('SIGINT', () => {
  console.log('[INFO] SIGINT received. Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('[INFO] SIGTERM received. Stopping bot...');
  bot.stop('SIGTERM');
});
