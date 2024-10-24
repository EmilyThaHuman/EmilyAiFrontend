import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { staticDataApi } from 'api/static';
import { authApi, userApi } from 'api/user';
import avatar5 from 'assets/img/avatars/avatar5.png'; // Fallback avatar

import {
  setHomeWorkSpace,
  setSelectedWorkspace,
  setSessionId,
  setWorkspaceId,
  setWorkspaces,
} from '../chat';
import {
  createAsyncThunkWithErrorHandling,
  getLocalData,
  setLocalData,
} from '../helpers';

const LOCAL_NAME = 'userStore';
const REDUX_NAME = 'user';

const initialState = {
  ...getLocalData(LOCAL_NAME, REDUX_NAME),
  isSettingUp: false,
  loading: false,
  isAuthLoading: false,
};

function setLocalUserData(data) {
  setLocalData(LOCAL_NAME, data);
}

export const handleAuthSubmit = createAsyncThunk(
  'auth/handleAuthSubmit',
  async (values, { dispatch, rejectWithValue }) => {
    console.log('values:', values);
    const { username, password, email, isSignup } = values;
    dispatch(setIsAuthLoading(true));
    try {
      const data = isSignup
        ? await authApi.signup(username, email, password)
        : await authApi.login(email || username, password);
      console.log('data:', data);
      if (!data.accessToken) {
        console.log('Error:', data.message);
        return rejectWithValue(data.message);
      }
      if (data?.accessToken) {
        console.log('res data:', data);

        const updatedUserData = {
          userId: data.user._id,
          username: data.user.username,
          email: data.user.email,
          isAuthenticated: true,
          profile: data.user.profile,
        };
        dispatch(setUser(updatedUserData));
        dispatch(setProfile(updatedUserData.profile));
        dispatch(setIsAuthenticated(true));
        dispatch(
          setAuthSession({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          })
        );
        dispatch(setWorkspaceId(data.workspaceId));
        dispatch(setSessionId(data.chatSessionId));
        if (isSignup) {
          console.log('data.workspaceId:', data.workspaceId);
          dispatch(setIsSettingUp(true));
        }
        // setLocalUserData({
        //   ...initialState,
        //   isAuthenticated: true,
        //   user: updatedUserData,
        // });
        // if (isSignup) {
        //   navigate('/auth/setup');
        // } else {
        //   navigate('/admin/dashboard');
        // }
        // if (isSignup && data.workspaceId) {
        //   window.location.href = `setup`;
        // }
        return {
          user: updatedUserData,
          isSettingUp: isSignup,
          navigateTo: isSignup ? '/auth/setup' : '/admin/dashboard',
        };
      }
    } catch (error) {
      console.error(isSignup ? 'Signup failed:' : 'Login failed:', error);
      dispatch(setIsAuthLoading(false));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateToken = createAsyncThunkWithErrorHandling(
  'auth/validateToken',
  async (token, { rejectWithValue }) => {
    await authApi.validateToken(token);
    return true;
  }
);

export const refreshAccessToken = createAsyncThunkWithErrorHandling(
  'auth/refresh-token',
  async (token, { rejectWithValue }) => {
    const data = await authApi.refreshToken(token);
    return data.accessToken;
  }
);

export const logout = createAsyncThunkWithErrorHandling(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    const token = sessionStorage.getItem('accessToken');
    await authApi.logout(token);
    localStorage.clear();
    sessionStorage.clear();
    dispatch(clearUser());
    return true;
  }
);

export const fetchUserProfileImage = createAsyncThunkWithErrorHandling(
  'user/fetchUserProfileImage',
  async (username, { rejectWithValue }) => {
    const imagename = username ? 'avatar1' : 'avatar5';
    const imgWithExt = `${imagename}.png`;
    const response = await staticDataApi.getProfileImage(imgWithExt);
    return response;
  }
);

export const setAuthUserData = createAsyncThunkWithErrorHandling(
  'user/setAuthUserData',
  async (_, { dispatch, rejectWithValue }) => {
    const storedUserData = JSON.parse(localStorage.getItem(LOCAL_NAME));

    if (!storedUserData) {
      return;
    }

    const { username } = storedUserData.user;
    let imageUrl = null;
    let imageRetrievalStatus = false;
    if (!storedUserData?.selectedProfileImage) {
      imageUrl = (await dispatch(fetchUserProfileImage(username))).payload;
      imageRetrievalStatus = true;
      dispatch(setSelectedProfileImage(imageUrl));
    }

    const {
      workspaces,
      folders,
      presets,
      prompts,
      models,
      chatSessions,
      collections,
      files,
      assistants,
      tools,
    } = storedUserData.user;

    const homeWorkSpace = workspaces?.find(
      workspace => workspace.isHome === true
    );
    const updatedHomeWorkSpace = {
      ...homeWorkSpace,
      folders,
      files,
      chatSessions,
      assistants,
      prompts,
      tools,
      models,
      presets,
      collections,
      active: true,
    };

    dispatch(setWorkspaces(workspaces));
    dispatch(setHomeWorkSpace(updatedHomeWorkSpace));
    dispatch(setSelectedWorkspace(updatedHomeWorkSpace));
    dispatch(setWorkspaceId(updatedHomeWorkSpace._id));

    return {
      ...storedUserData.user,
      profileImage: imageUrl,
      isImageRetrieved: imageRetrievalStatus,
    };
  }
);

export const addEnvToUser = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/addEnvToUser`,
  async ({ apiKey }, { rejectWithValue }) => {
    const response = await userApi.addEnvToUser(
      sessionStorage.getItem('userId'),
      apiKey
    );
    return response;
  }
);

export const userSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    resetUserInfo: state => {
      const defaultUserInfo = {
        name: '',
        email: '',
        profileImage: avatar5, // Add default profile image to state
        isImageRetrieved: false,
      };
      setLocalUserData({ ...state, userInfo: defaultUserInfo });
      state.userInfo = defaultUserInfo;
    },
    setAuthSession: (state, action) => {
      console.log('AUTH SESSION', action.payload);
      state.authSession = action.payload;
      setLocalUserData({ ...state, authSession: action.payload });
    },
    setUser: (state, action) => {
      const user = action.payload;
      console.log('USER SLICE ACTION PAYLOAD:', user);
      setLocalUserData({ ...state, ...user });
      state.user = user;
    },
    setUserOpenAiSettings: (state, action) => {
      const openAiSettings = action.payload;
      const userOpenAiSettings = state.user.openai || {};
      const updatedUser = {
        ...state.user,
        openai: { ...userOpenAiSettings, ...openAiSettings },
      };
      setLocalUserData({ ...state, user: updatedUser });
      state.openAiSettings = openAiSettings;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      setLocalUserData({ ...state, profile: action.payload });
    },
    setEnvKeyMap: (state, action) => {
      state.envKeyMap = action.payload;
    },
    setSelectedProfileImage: (state, action) => {
      console.log('SET SELECTED PROFILE IMAGE', action.payload);
      state.selectedProfileImage = action.payload;
      state.isImageRetrieved = Boolean(action.payload);
      setLocalUserData({
        ...state,
        selectedProfileImage: action.payload,
        isImageRetrieved: true,
      });
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      setLocalUserData({ ...state, isAuthenticated: action.payload });
    },
    setIsSettingUp: (state, action) => {
      state.isSettingUp = action.payload;
      setLocalUserData({ ...state, isSettingUp: action.payload });
    },
    setIsAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
      setLocalUserData({ ...state, isAuthLoading: action.payload });
    },
    setIsRedirectToSignin: state => {
      state.isRedirectToSignin = !state.isRedirectToSignin;
      setLocalUserData({
        ...state,
        isRedirectToSignin: state.isRedirectToSignin,
      });
    },
    clearUser: state => {
      console.log('CLEAR USER');
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(handleAuthSubmit.pending, state => {
        state.loading = true;
      })
      .addCase(handleAuthSubmit.fulfilled, (state, action) => {
        state.loading = false;
        console.log('USER AUTH SUCCESS PAYLOAD:', action.payload.user);
        state.user = action.payload.user; // Update state with user data
        state.isAuthenticated = true; // Ensure isAuthenticated is set to true
        state.isSettingUp = action.payload.isSettingUp;
        setLocalUserData({
          ...state,
          isSettingUp: state.isSettingUp,
        });
        window.location.reload();
        // state.user = action.payload.user;
      })
      .addCase(handleAuthSubmit.rejected, state => {
        state.loading = false;
      })
      .addCase(refreshAccessToken.pending, state => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, state => {
        state.user = {};
        state.isAuthenticated = false;
      });
  },
});

export const {
  resetUserInfo,
  setUser,
  setIsAuthenticated,
  setUserOpenAiSettings,
  setIsRedirectToSignin,
  setProfile,
  setSelectedProfileImage,
  setEnvKeyMap,
  setAuthSession,
  setIsSettingUp,
  setIsAuthLoading,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
