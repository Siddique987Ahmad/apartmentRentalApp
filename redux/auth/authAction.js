import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/user/login', credentials);
    console.log("data",res.data)
    await AsyncStorage.setItem('userToken', res.data.token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post('user/register', data);
    await AsyncStorage.setItem('userToken', res.data.token); // adjust key if needed
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});
