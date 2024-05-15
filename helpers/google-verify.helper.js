import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export const googleVerify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();

  return {
    name,
    email,
    image: picture,
  };
};
