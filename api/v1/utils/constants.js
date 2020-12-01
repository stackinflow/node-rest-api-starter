require("dotenv").config();

const SuccessMessages = Object.freeze({
  SUCCESS: "success",
  VERIFY_MAIL_SENT:
    "A verification link has been sent to your email, please check inbox",
  ACC_VERIFIED: "Your account has been verified, please login now",
  PASSWORD_UPDATED: "Your password has been changed",
  OTP_SENT: "An OTP has been sent to your email",
  OTP_RESENT: "An OTP has been resent to your email",
  PASSWORD_RESET: "Your password has been reset, please login now",
  ACC_DELETED: "Your account has been deleted successfully",
  FETCHED_USERS: "Fetched users",
  FETCHED_ADMINS: "Fetched admins",
  DISABLED: "disabled",
  ENABLED: "enabled",
  ACCESS_DISABLED: "User access disabled",
  ACCESS_ENABLED: "User access enabled",
  LOGIN_SUCCESS: "Login success",
  TOKENS_REFRESHED: "Tokens have been refreshed",
  FETCHED_USER_DATA: "Fetched user data",
  UPDATED_USER_DATA: "Updated user data",
  RESENT_VERIFY_EMAIL: "Verification token has been resent to your email",
  USERNAME_AVAILABLE: "Username available",
});

const errorMessages = Object.freeze({
  UNAUTHORIZED: "Unauthorized",
  SPECIFY_VALID_TOKEN: "Please specify valid token",
  SPECIFY_VALID_HEADER: "Please specify valid auth header",
  FAILED: "failed",
  OTP_ALREADY_SENT:
    "We've already sent an OTP to the registered email, please try resend endpoint to get a new OTP.",
  ACCESS_TOKEN_EXPIRED: "Access token expired",
  INVALID_AUTH_TYPE: "Unsupported type of authentication",
  INVALID_PASSWORD:
    "Password should have 1 uppercase letter, 1 special character, 1 number, 1 lowercase letter",
  EMAIL_IN_USE: "Email already in use",
  REGISTER_FAILED: "Failed to register",
  USER_NOT_EXISTS: "User doesn't exists",
  TRY_LATER: "please try later",
  INVALID_EMAIL_PASSWORD: "Email or password is invalid",
  INCORRECT_PASSWORD: "You have entered an incorrect password",
  INVALID_TOKEN: "Invalid/malformed token",
  INVALID_EXPIRED_VERIFY_TOKEN: "Verification token expired/invalid",
  UNABLE_TO_VERIFY: "Failed to verify your account",
  ACCOUNT_ALREADY_VERIFIED: "Account already verified",
  OLD_PASSWORD_IS_SAME: "Old password can not be new password",
  PASSWORD_CHANGE_FAILED: "Failed to change your password",
  INVALID_EXPIRED_OTP: "OTP is invalid/expired, please request for new OTP",
  TOKEN_REFRESH_FAILED: "Failed to refresh tokens",
  INVALID_MALFORMED_REFRESH_TOKEN: "Invalid/malformed refresh token",
  ACC_DELETE_FAILED: "Failed to deleted your account",
  FETCH_USERS_FAILED: "Failed to fetch users",
  FETCH_ADMINS_FAILED: "Failed to fetch admins",
  FACEBOOK_LOGIN_FAILED: "Failed to login with Facebook",
  FACEBOOK_GOOGLE_FAILED: "Failed to login with Google",
  USER_ACCESS_ALREADY: "User already has access",
  ACCESS_DISABLE_FAILED: "Failed to disable user access",
  ACCESS_ENABLE_FAILED: "Failed to enable user access",
  FB_REGISTER_FAILED: "Failed to register with Facebook",
  GOOGLE_REGISTER_FAILED: "Failed to register with Google",
  EMAIL_IN_USE_BY_OTHER_PROVIDER: "Email is used by other type of signin",
  ACCOUNT_NOT_VERIFIED:
    "Account not verified, please check your email and verify your account",
  ACC_DISABLED:
    "Your account has been disabled access for suspicious activity, please contact support for more information",
  LOGIN_NOT_ALLOWED: "You are not allowed to login here",
  ACC_UNDER_REVIEW:
    "Your account is under review, please contact support for more information.",
  LOGIN_FAILED: "Login failed",
  SESSION_EXPIRED: "Session expired, please login",
  OAUTH_LOGIN_FAILED: "Failed to get data from oauth server",
  OAUTH_TOKEN_REFRESH_ERROR: "Failed to refresh token, oauth server error",
  OPERATION_NOT_PERMITTED: "You are not permitted to perform this operation",
  ACC_VERIFICATION_PENDING_BY_TEAM:
    "Your account is not verified by our team, please contact support for more information",
  PASSWORD_DOES_NOT_CONTAIN_NUMBER: "password must contain at least one number",
  PASSWORD_DOES_NOT_CONTAIN_LOWERCASE:
    "password must contain at least one lowercase letter",
  PASSWORD_DOES_NOT_CONTAIN_UPPERCASE:
    "password must contain at least one uppercase letter",
  PASSWORD_DOES_NOT_CONTAIN_SPECIAL_CHAR:
    "password must contain at least one special character",
  USER_DATA_UPDATE_FAILED: "Failed to update user data",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_USERNAME: "Invalid username",
  USERNAME_IN_USE: "Username taken",
});

const HEADERS_URLS = Object.freeze({
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

const collections = Object({
  AUTH_COLLECTION: "auth",
  TOKEN_COLLECTION: "token",
  USER_COLLECTION: "user",
});

module.exports = Object.freeze({
  headers: HEADERS_URLS,
  errors: errorMessages,
  successMessages: SuccessMessages,
  collections: collections,
});
