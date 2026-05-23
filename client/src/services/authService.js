import api from './api';

/**
 * PHASE 1: Updated to handle dual-token system
 * New response format:
 *   {
 *     success: true,
 *     user: { _id, name, email, role },
 *     tokens: { accessToken, expiresIn, tokenType }
 *   }
 */

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  
  // Extract and return new token format
  if (data.success && data.tokens) {
    return {
      success: true,
      user: data.user,
      accessToken: data.tokens.accessToken,
      expiresIn: data.tokens.expiresIn,
      tokenType: data.tokens.tokenType || 'Bearer',
    };
  }
  
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  
  // Extract and return new token format
  if (data.success && data.tokens) {
    return {
      success: true,
      user: data.user,
      accessToken: data.tokens.accessToken,
      expiresIn: data.tokens.expiresIn,
      tokenType: data.tokens.tokenType || 'Bearer',
    };
  }
  
  return data;
};

/**
 * PHASE 1: Refresh access token using refresh token from cookie
 * Refresh token is automatically sent via cookie (httpOnly)
 */
export const refreshAccessToken = async () => {
  try {
    const { data } = await api.post('/auth/refresh');
    
    if (data.success && data.tokens) {
      return {
        success: true,
        accessToken: data.tokens.accessToken,
        expiresIn: data.tokens.expiresIn,
        tokenType: data.tokens.tokenType || 'Bearer',
      };
    }
    
    return data;
  } catch (error) {
    // If refresh fails, token is likely expired
    // AuthContext will handle logout
    throw error;
  }
};

/**
 * PHASE 1: Logout user and revoke current session
 */
export const logoutUser = async () => {
  try {
    return await api.post('/auth/logout');
  } catch (error) {
    // Even if request fails, clear local state
    throw error;
  }
};

/**
 * PHASE 1: Logout all devices
 */
export const logoutAllDevices = async () => {
  try {
    return await api.post('/auth/logout-all');
  } catch (error) {
    throw error;
  }
};

/**
 * PHASE 1: Get current user profile
 */
export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

/**
 * PHASE 1: Update user profile
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/me', payload);
  return data;
};

/**
 * PHASE 2: Get all active sessions for current user
 */
export const getActiveSessions = async () => {
  try {
    const { data } = await api.get('/auth/sessions');
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * PHASE 2: Revoke a specific session by ID
 */
export const revokeSession = async (sessionId) => {
  try {
    const { data } = await api.delete(`/auth/sessions/${sessionId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
