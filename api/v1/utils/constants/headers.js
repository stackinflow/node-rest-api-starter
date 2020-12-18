module.exports = Object.freeze({
  AUTHORIZATION_HEADER: "Authorization",
  BASIC: "Basic",
  BEARER: "Bearer",
  GRANT_TYPE: "grant_type",
  CREDENTIALS: "credentials",
  TOKEN: "token",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  EMAIL: "email",
  PASSWORD: "password",
  EXPIRED: "Expired",
  EXPIRE: "expire",
  BASE64: "base64",
  FB_OAUTH_URL:
    "https://graph2.facebook.com/v2.12/me?fields=first_name,last_name,email&access_token=",
  FB_OAUTH_REFRESH: `https://graph2.facebook.com/oauth/access_token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=fb_exchange_token&fb_exchange_token=`,
  GOOGLE_OAUTH_URL:
    "https://www.googleapis.com/oauth2/v3/userinfo?access_token=",
  EMAIL_KEY: "Email",
  GOOGLE_KEY: "Google",
  FACEBOOK_KEY: "Facebook",
});
