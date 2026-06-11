import api from './api';

const normalizeAuthPayload = (payload) => {
  const source = payload?.data || payload;
  const user = source?.user;
  const accessToken = source?.accessToken || source?.token || source?.tokens?.accessToken;

  return {
    success: Boolean(payload?.success ?? source?.success ?? true),
    user,
    role: user?.role,
    token: accessToken,
    accessToken,
    sessionId: source?.sessionId,
    expiresIn: source?.tokens?.expiresIn || source?.expiresIn,
    tokenType: source?.tokens?.tokenType || source?.tokenType || 'Bearer',
  };
};

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
  return normalizeAuthPayload(data);
};

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return normalizeAuthPayload(data);
};

/**
 * PHASE 1: Refresh access token using refresh token from cookie
 * Refresh token is automatically sent via cookie (httpOnly)
 */
export const refreshAccessToken = async () => {
  try {
    const { data } = await api.post('/auth/refresh');
    return normalizeAuthPayload(data);
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
  return data.data || data;
};

/**
 * PHASE 1: Update user profile
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/me', payload);
  return data.data || data;
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
