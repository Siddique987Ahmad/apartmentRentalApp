import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleAuthResponse = async (res) => {
  const { token } = res.data;
  if (token) {
    await AsyncStorage.setItem('userToken', token);
  }
  return res.data;
};

const getErrorMessage = (err) =>
  err?.response?.data?.message || 'Something went wrong. Please try again.';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/user/login', credentials);
    return await handleAuthResponse(res);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post('/user/register', data);
    return await handleAuthResponse(res);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});
