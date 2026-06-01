const authService = require('../services/auth.service');
const sendResponse = require('../utils/sendResponse');

/**
 * Controller for handling authentication-related requests.
 * Uses httpOnly cookies for access and refresh tokens.
 */
class AuthController {
  /**
   * Set authentication cookies (access and refresh tokens).
   * @param {Object} tokens - Access and refresh tokens.
   * @param {Object} res - Express response object.
   */
  setAuthCookies(tokens, res) {
    const { accessToken, refreshToken } = tokens;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  /**
   * Sign in a user and set authentication cookies.
   */
  async signIn(req, res) {
    const { identifier, password } = req.body;

    try {
      const { user, accessToken, refreshToken } = await authService.signIn(identifier, password);
      
      this.setAuthCookies({ accessToken, refreshToken }, res);

      return sendResponse(res, 200, 'success', 'Signed in successfully', {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return sendResponse(res, 401, 'fail', error.message || 'Invalid credentials');
    }
  }

  /**
   * Refresh the access token using the refresh token from cookies.
   */
  async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return sendResponse(res, 401, 'fail', 'Refresh token not found');
    }

    try {
      const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

      this.setAuthCookies({ accessToken, refreshToken: newRefreshToken }, res);

      return sendResponse(res, 200, 'success', 'Token refreshed successfully', {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return sendResponse(res, 401, 'fail', error.message || 'Invalid refresh token');
    }
  }

  /**
   * Create a new user account (Superadmin only).
   */
  async createAccount(req, res) {
    const userData = req.body;

    try {
      const newUser = await authService.createUser(userData);
      return sendResponse(res, 201, 'success', 'Account created successfully', {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        },
      });
    } catch (error) {
      return sendResponse(res, 400, 'fail', error.message || 'Failed to create account');
    }
  }

  /**
   * Log out the user by clearing cookies and removing refresh token.
   */
  async logout(req, res) {
    const userId = req.userId; // Provided by 'authenticate' middleware

    if (userId) {
      await authService.logout(userId);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return sendResponse(res, 200, 'success', 'Logged out successfully');
  }

  /**
   * Get current user's profile (Requires authentication).
   */
  async getMe(req, res) {
    const user = req.user;
    return sendResponse(res, 200, 'success', 'User profile retrieved successfully', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  }
}

const controller = new AuthController();
module.exports = {
  signIn: controller.signIn.bind(controller),
  refreshToken: controller.refreshToken.bind(controller),
  createAccount: controller.createAccount.bind(controller),
  logout: controller.logout.bind(controller),
  getMe: controller.getMe.bind(controller),
};
