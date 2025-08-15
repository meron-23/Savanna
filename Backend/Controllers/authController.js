import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();

    // Find or create user (implement this in your user service)
    const user = await UserService.findOrCreate({
      googleId, name, email, picture
    });

    // Create session
    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};