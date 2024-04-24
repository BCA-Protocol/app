export const getDiscordOauthUrl = () => {
  return `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&response_type=code&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&scope=identify+email`;
};