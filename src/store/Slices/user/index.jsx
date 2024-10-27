// user/index.js
import userReducer, {
  fetchUserProfileImage,
  resetUserInfo,
  setUser,
  setIsAuthenticated,
  setUserOpenAiSettings,
  setIsRedirectToSignin,
  setAuthUserData,
  handleAuthSubmit,
  logout,
  refreshAccessToken,
  setProfile,
  setEnvKeyMap,
  setSelectedProfileImage,
  addEnvToUser,
  setAuthSession,
  setIsAuthLoading,
  setIsSettingUp,
  setIsSigningUp,
  setIsSignedUp,
  setIsSetup,
} from './userSlice';

// Exporting all actions and thunks
export {
  // User actions and thunks
  setIsSettingUp,
  addEnvToUser,
  setIsAuthLoading,
  setProfile,
  setEnvKeyMap,
  setSelectedProfileImage,
  handleAuthSubmit,
  logout,
  refreshAccessToken,
  setIsRedirectToSignin,
  fetchUserProfileImage,
  resetUserInfo,
  setUser,
  setIsAuthenticated,
  setUserOpenAiSettings,
  setAuthUserData,
  setAuthSession,
  setIsSigningUp,
  setIsSignedUp,
  setIsSetup,
};

// Exporting reducers
export { userReducer };
