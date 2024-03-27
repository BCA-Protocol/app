import { NextResponse } from "next/server";

const BasicAuthToken = Buffer.from(
  `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
  "utf8"
).toString("base64");

export async function GET(request, response) {
  try {

    const params = await request.nextUrl.searchParams;
    const code = params.get("code");
    const tokenData = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${BasicAuthToken}`,
      },
      body: new URLSearchParams({
        // client_id: process.env.TWITTER_CLIENT_ID,
        code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        grant_type: "authorization_code",
        code: code,
      }).toString(),
    }).then((res) => res.json());
    const userData = await fetch("https://api.twitter.com/2/users/me", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    }).then((res) => res.json());
    return NextResponse.json({userData:userData.data});
  } catch (err) {
    console.error("Twitter Sign-In Error:", err);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
