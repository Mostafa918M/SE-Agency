const User = require('../models/user.model');
const tokenUtils = require('../utils/tokenUtils');

/**
 * Handle user authentication and token generation.
 * Supports sign-in with username, email, or phone number.
 */
class AuthService {
  /**
   * Find a user by username, email, or phone number.
   * @param {string} identifier - Username, email, or phone number.
   * @returns {Promise<Object|null>} - Found user or null.
   */
  async findUserByIdentifier(identifier) {
    return await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phoneNumber: identifier },
      ],
    });
  }

  /**
   * Sign in a user.
   * @param {string} identifier - Username, email, or phone number.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} - User object and tokens.
   */
  async signIn(identifier, password) {
    const user = await this.findUserByIdentifier(identifier);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: user._id, role: user.role };
    const accessToken = tokenUtils.generateAccessToken(payload);
    const refreshToken = tokenUtils.generateRefreshToken(payload);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh the access token using a refresh token.
   * @param {string} refreshToken - User's refresh token.
   * @returns {Promise<Object>} - New access and refresh tokens.
   */
  async refreshAccessToken(refreshToken) {
    const decoded = tokenUtils.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const payload = { userId: user._id, role: user.role };
    const newAccessToken = tokenUtils.generateAccessToken(payload);
    const newRefreshToken = tokenUtils.generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Create a new user account (Superadmin only).
   * @param {Object} userData - Data for the new user.
   * @returns {Promise<Object>} - Newly created user.
   */
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  /**
   * Remove refresh token from DB (logout logic).
   * @param {string} userId - ID of the user to log out.
   */
  async logout(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }
}

module.exports = new AuthService();
