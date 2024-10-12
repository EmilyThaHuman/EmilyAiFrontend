import { apiUtils } from '@/lib/apiUtils';

export const userApi = {
  getUserById: async id => {
    try {
      const data = await apiUtils.get(`/user/${id}`);
      console.log('User data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  getSession: async () => {
    try {
      const data = await apiUtils.get(`/user/session`);
      console.log('Session data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },
  checkUsernameAvailability: async username => {
    try {
      const data = await apiUtils.post(`/user/check-username`, { username });
      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  },
  addEnvToUser: async (userId, apiKey) => {
    try {
      const data = await apiUtils.post(`/user/${userId}/addApiKey`, {
        clientApiKey: apiKey,
      });
      return data;
    } catch (error) {
      console.error('Error adding API key to user:', error);
      throw error;
    }
  },
  getWorkspacesByUserId: async userId => {
    try {
      const data = await apiUtils.get(`/user/${userId}/workspaces`);
      return data;
    } catch (error) {
      console.error('Error fetching workspaces by user ID:', error);
      throw error;
    }
  },
  updateProfile: async (userId, profileData) => {
    try {
      const data = await apiUtils.put(`/user/${userId}/profile`, profileData);
      console.log('Updated profile data:', data);
      return data.profile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

export default userApi;
