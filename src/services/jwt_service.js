import jwt from "jsonwebtoken";

class JWTService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: process.env.JWT_ACCESS_TIME,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: process.env.JWT_REFRESH_TIME,
    });

    return { accessToken, refreshToken };
  }

  generateLinkToken(payload) {
    const linkToken = jwt.sign(payload, process.env.ACTIVATION_URL_KEY, {
      expiresIn: process.env.ACTIVATION_URL_TIME,
    });

    return linkToken;
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  }

  async verifyLinkToken(token) {
    return jwt.verify(token, process.env.ACTIVATION_URL_KEY);
  }
}

export default new JWTService();
