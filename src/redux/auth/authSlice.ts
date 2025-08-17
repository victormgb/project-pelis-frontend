import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

axios.defaults.withCredentials = true;

const API_URL = `${import.meta.env.VITE_API_HOST}/api`;

// Define interfaces for your data structures
interface User {
  _id: string;
  username: string;
  email: string;
  // Add any other user properties here
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  fetchingUser: boolean;
}

// Define the initial state for the auth slice with its type
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,
};

// Define async thunks for API calls
// Signup Thunk
export const signup = createAsyncThunk<
  User, // Return type of the fulfilled action
  { username: string; email: string; password: string }, // Argument type for the thunk
  { rejectValue: string | null } // Type for the rejectWithValue
>(
  'auth/signup',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      return response.data.user;
    } catch (error: any) { // Use 'any' for error to access response.data safely
      return rejectWithValue(error.response?.data?.message || 'Error Signing up');
    }
  }
);

// Login Thunk
export const login = createAsyncThunk<
  { user: User; message: string }, // Return type of the fulfilled action
  { username: string; password: string }, // Argument type for the thunk
  { rejectValue: string | null } // Type for the rejectWithValue
>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      console.log("response", response);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error logging in');
    }
  }
);

// Fetch User Thunk
export const fetchUser = createAsyncThunk<
  User | null, // Return type of the fulfilled action
  void, // Argument type for the thunk (none)
  { rejectValue: string | null } // Type for the rejectWithValue
>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/fetch-user`);
      return response.data.user;
    } catch (error: any) {
      // If fetching user fails, it often means no user is logged in,
      // so we clear the user state without setting an error message.
      // We return null as the payload for rejected, to explicitly clear user.
      return rejectWithValue(error.response?.data?.message || null); // Return null to indicate no user
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk<
  string, // Return type of the fulfilled action (message string)
  void, // Argument type for the thunk (none)
  { rejectValue: string | null } // Type for the rejectWithValue
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error logging out');
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reducers if needed (e.g., to clear errors manually)
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action: PayloadAction<string | null | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error during signup';
        state.user = null; // Ensure user is null on signup failure
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; message: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | null | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error during login';
        state.user = null; // Ensure user is null on login failure
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.fetchingUser = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.fetchingUser = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.fetchingUser = false;
        state.user = null; // Always clear user if fetch fails
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.user = null;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<string | null | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error during logout';
        // Keep user as null or previous state depending on desired behavior for failed logout
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;


export const selectFetchingUser = (state: RootState) => state?.auth?.fetchingUser;
export const selectUser = (state: RootState) => state?.auth?.user;
export const selectIsLoading = (state: RootState) => state?.auth?.isLoading;
export const selectError = (state: RootState) => state?.auth?.error;

// --- Your existing store configuration, updated ---

// import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit';

// // Import the new auth reducer
// import authReducer from './authSlice'; // Assuming authSlice.ts or .js

// const rootReducer = combineReducers({
//   auth: authReducer, // Add the auth slice here
//   // counter: counterReducer,
//   // entries: entrriesReducer,
//   // images: imagesReducer
// });

// export const setupStore = (preloadedState?: Partial<RootState>) => {
//   return configureStore({
//     reducer: rootReducer,
//     preloadedState,
//   });
// };

// export type AppStore = ReturnType<typeof setupStore>;
// export type AppDispatch = AppStore['dispatch'];
// export type RootState = ReturnType<typeof rootReducer>;

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
