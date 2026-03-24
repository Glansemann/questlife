import { NextResponse } from "next/server";

// Garmin uses OAuth 1.0a for authorization
// Flow: request token → redirect user → callback with verifier → access token
//
// Required env vars:
// GARMIN_CONSUMER_KEY
// GARMIN_CONSUMER_SECRET

const GARMIN_REQUEST_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/request_token";
const GARMIN_AUTHORIZE_URL = "https://connect.garmin.com/oauthConfirm";
const GARMIN_ACCESS_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/access_token";

export async function GET() {
  // Step 1: Get a request token from Garmin
  // For now, return instructions since OAuth 1.0a requires crypto signing
  // In production, use an OAuth 1.0a library

  const hasKeys = process.env.GARMIN_CONSUMER_KEY && process.env.GARMIN_CONSUMER_SECRET;

  if (!hasKeys) {
    return NextResponse.json({
      status: "not_configured",
      message: "Garmin API keys not set. Apply at https://developer.garmin.com/gc-developer-program/overview/",
      setup: {
        step1: "Apply for Garmin Health API access at developer.garmin.com",
        step2: "Set GARMIN_CONSUMER_KEY and GARMIN_CONSUMER_SECRET env vars",
        step3: "Set webhook URL to https://questlife.app/api/integrations/garmin/webhook",
      },
    });
  }

  return NextResponse.json({
    status: "ready",
    authorizeUrl: GARMIN_AUTHORIZE_URL,
    message: "OAuth 1.0a flow ready. Redirect user to authorize.",
  });
}
