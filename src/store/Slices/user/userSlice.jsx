import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

import staticDataApi from 'api/static/staticData';
import { authApi, userApi } from 'api/user';
import avatar5 from 'assets/img/avatars/avatar5.png'; // Fallback avatar

import {
  setAssistants,
  setChatMessages,
  setChatSessions,
  setCollections,
  setFiles,
  setFolders,
  setHomeWorkSpace,
  setModels,
  setPresets,
  setPrompts,
  setSelectedAssistant,
  setSelectedChatSession,
  setSelectedPreset,
  setSelectedPrompt,
  setSelectedTools,
  setSelectedWorkspace,
  setSessionId,
  setTools,
  setWorkspaceId,
  setWorkspaces,
} from '../chat';
import { getLocalData, setLocalData } from '../helpers';

const LOCAL_NAME = 'userStore';
const REDUX_NAME = 'user';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalUserData(data) {
  setLocalData(LOCAL_NAME, data);
}
/**
 * Function to remove all array data from an object.
 * It recursively traverses the object and removes arrays while preserving other properties.
 * @param {Object} data - The input object from which to remove array data.
 * @returns {Object} - The modified object with arrays removed.
 */
function removeArrayData(data) {
  if (Array.isArray(data)) {
    // If the current value is an array, return an empty array.
    return [];
  } else if (typeof data === 'object' && data !== null) {
    // Recursively process each key in the object.
    const result = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        // Recursively call the function to handle nested objects.
        result[key] = removeArrayData(value);
      }
    }
    return result;
  } else {
    // Return the value as-is if it is neither an array nor an object.
    return data;
  }
}
function removeEmptyArrayFields(folderData) {
  // Iterate over each key in the object
  for (const key in folderData) {
    // Check if the value is an array and is empty
    if (Array.isArray(folderData[key]) && folderData[key].length === 0) {
      delete folderData[key]; // Remove the empty array field
    }
  }
  return folderData;
}
function dispatchUserUpdates(dispatch, userData, profileData, workspacesData) {
  console.log('Dispatching user updates:', userData);
  const workspaceFolders = workspacesData[0].folders;
  const leanFolderArray = [];
  const folderMap =
    workspaceFolders &&
    workspaceFolders.reduce((acc, folder) => {
      const leanFolder = {
        _id: folder._id,
        userId: folder.userId,
        workspaceId: folder.workspaceId,
        name: folder.name,
        description: folder.description,
        path: folder.path,
        space: folder.space,
        [`${folder.space}`]: [`${folder.space}`],
        // space: folder.space,
        // [`${folder.space}`]:
        //   folder.space === 'files' ||
        //   folder.space === 'prompts' ||
        //   folder.space === 'assistants'
        //     ? folder[`${folder.space}`]
        //     : [],
      };
      leanFolderArray.push(leanFolder);
      console.table(
        'folder:',
        leanFolder,
        'space:',
        folder.space,
        'value:',
        folder[`${folder.space}`].slice(0, 2)
      );
      acc[folder.space] = leanFolder;
      return acc;
    }, {});
  console.log('folderMap:', folderMap);
  const filteredSpaces = removeArrayData(workspacesData);
  const leanSpaces = {
    ...filteredSpaces[0],
    assistants: folderMap.assistants.assistants,
    chatSessions: workspacesData[0].chatSessions || {
      sessionId: workspacesData[0].chatSessions,
      messages: [],
    },
    files: folderMap.files.files,
    collections: folderMap.collections.collections,
    prompts: folderMap.prompts.prompts,
    models: folderMap.models.models,
    presets: folderMap.presets.presets,
    tools: folderMap.tools.tools,
  };
  // const leanSpaces = {
  //   ...filteredSpaces[0],
  //   assistants: folderMap.assistants.assistants,
  //   chatSessions: workspacesData[0].chatSessions,
  //   files: folderMap.files.files,
  //   collections: folderMap.collections.collections,
  //   prompts: folderMap.prompts.prompts,
  //   models: folderMap.models.models,
  //   presets: folderMap.presets.presets,
  //   tools: folderMap.tools.tools,
  // };
  dispatch(setUser(userData));
  dispatch(setProfile(profileData));
  dispatch(setWorkspaces(leanSpaces));
  dispatch(setSelectedWorkspace(leanSpaces[0]));
  dispatch(setChatSessions(workspacesData[0].chatSessions));
  dispatch(setFolders(leanFolderArray));
  dispatch(setFiles(folderMap['files'].files));
  dispatch(setCollections(folderMap['collections'].collections));
  dispatch(setPrompts(folderMap['prompts'].prompts));
  dispatch(setPresets(folderMap['presets'].presets));
  dispatch(setModels(folderMap['models'].models));
  dispatch(setAssistants(folderMap['assistants'].assistants));
  dispatch(setIsAuthenticated(true));
}

export const handleAuthSubmit = createAsyncThunk(
  'auth/handleAuthSubmit',
  async (values, { dispatch, rejectWithValue }) => {
    const { username, password, email, isSignup } = values;
    try {
      const data = isSignup
        ? await authApi.signup(username, email, password)
        : await authApi.login(email || username, password);

      if (data?.accessToken) {
        console.log('res data:', data);

        const updatedUserData = {
          // ...data.user,
          userId: data.user._id,
          username: data.user.username,
          email: data.user.email,
          isAuthenticated: true,
          // profile: data.user.profile,
          // workspaces: data.user.workspaces,
        };
        const workspacesData = {
          ...data.user.workspaces,
        };
        const profileData = {
          ...data.user.profile,
        };

        dispatchUserUpdates(
          dispatch,
          updatedUserData,
          profileData,
          workspacesData
        );
        sessionStorage.setItem(
          'workspaceId',
          updatedUserData.workspaces[0]._id
        );
        sessionStorage.setItem(
          'sessionId',
          updatedUserData.workspaces[0].chatSessions[0]?._id
        );
        window.location.href = '/admin/dashboard';
        return {
          user: updatedUserData,
        };
      }
    } catch (error) {
      console.error(isSignup ? 'Signup failed:' : 'Login failed:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (token, { rejectWithValue }) => {
    try {
      await authApi.validateToken(token);
      return true;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh-token',
  async (token, { getState, rejectWithValue }) => {
    const navigate = useNavigate();

    try {
      const data = await authApi.refreshToken(token);
      console.log('DATA', data);
      return data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      navigate('/auth/sign-in');
      return rejectWithValue(error.response.data);
      // window.location.href = '/auth/sign-in';
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const token = sessionStorage.getItem('accessToken');
    console.log('LOGOUT TOKEN', token);
    try {
      await authApi.logout(token);
      localStorage.clear();
      sessionStorage.clear();
      dispatch(setUser({}));
      return true;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfileImage = createAsyncThunk(
  'user/fetchUserProfileImage',
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const imagename = username ? 'avatar1' : 'avatar5';
      const imgWithExt = `${imagename}.png`;

      const response = await staticDataApi.getProfileImage(imgWithExt);
      console.log('Image response:', response);
      // Convert the blob to a URL
      // const imageSrc = URL.createObjectURL(response);
      // Convert the buffer to a base64 string if needed
      // const buffer = Buffer.from(response.data, 'binary').toString('base64');
      // const imageSrc = `data:image/png;base64,${buffer}`;
      // dispatch(
      //   setUser(prevUser => ({
      //     ...prevUser,
      //     profileImageName: 'avatar1.png',
      //     profileImage: response,
      //     isImageRetrieved: true,
      //   }))
      // );
      // dispatch(
      //   setProfile(prevProfile => ({
      //     ...prevProfile,
      //     imagePath: response,
      //   }))
      // );
      // dispatch(setSelectedProfileImage(response));
      return response;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const setAuthUserData = createAsyncThunk(
  'user/setAuthUserData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem(LOCAL_NAME));

      if (!storedUserData) {
        // throw new Error('No user data found in local storage');
        console.log('No user data found in local storage');
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
      console.log('HOME_WORKSPACE', homeWorkSpace);
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
      dispatch(setChatSessions(workspaces[0]?.chatSessions));
      const currentChatSession = updatedHomeWorkSpace?.chatSessions[0];
      dispatch(setSelectedChatSession(currentChatSession));
      dispatch(setChatMessages(currentChatSession?.messages));
      dispatch(setPresets(presets));
      dispatch(setSelectedPreset(presets[0]));
      dispatch(setPrompts(prompts));
      dispatch(setSelectedPrompt(prompts[0]));
      dispatch(setModels(models));
      dispatch(setCollections(collections));
      dispatch(setFolders(folders));
      dispatch(setFiles(files));
      dispatch(setAssistants(assistants));
      dispatch(setSelectedAssistant(assistants[0]));
      dispatch(setTools(tools));
      dispatch(setSelectedTools(tools));
      return {
        ...storedUserData.user,
        profileImage: imageUrl,
        isImageRetrieved: imageRetrievalStatus,
        userInfo: {
          ...storedUserData.userInfo,
          profileImage: imageUrl,
          isImageRetrieved: imageRetrievalStatus,
        },
      };
    } catch (error) {
      console.error('Error fetching user data from local storage:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const addEnvToUser = createAsyncThunk(
  `${REDUX_NAME}/addEnvToUser`,
  async ({ apiKey }, { rejectWithValue }) => {
    try {
      console.log('Adding API key:', apiKey);
      const response = await userApi.addEnvToUser(
        sessionStorage.getItem('userId'),
        apiKey
      );
      // dispatch(setApiKey(apiKey));
      // dispatch(setChatRequestData(response.message));
      return response;
      // await dispatch(addApiKey(apiKey));
      // dispatch(setChatRequestData({ message: 'Added API key successfully' }));
    } catch (error) {
      rejectWithValue(error.response.data);
    }
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
    setIsRedirectToSignin: state => {
      state.isRedirectToSignin = !state.isRedirectToSignin;
      setLocalUserData({
        ...state,
        isRedirectToSignin: state.isRedirectToSignin,
      });
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
} = userSlice.actions;

export default userSlice.reducer;
