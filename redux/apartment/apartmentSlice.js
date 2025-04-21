import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.70.159:4001/api/apartment';

// Utility function to get token
const getAuthHeaders = async (isFormData = false) => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
  };
};

// Fetch all apartments
export const fetchApartments = createAsyncThunk(
  'apartment/fetchAll',
  async ({ role, userId }, thunkAPI) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/getallapartments`, {
        headers,
        params: { role, userId },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch apartments'
      );
    }
  }
);

// Filter apartments
export const fetchFilteredApartments = createAsyncThunk(
  'apartment/fetchFiltered',
  async ({ minPrice, maxPrice, location, search }, thunkAPI) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/getfilteredapartments`, {
        headers,
        params: { minPrice, maxPrice, location, search },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to filter apartments'
      );
    }
  }
);

// Create apartment
export const createApartment = createAsyncThunk(
  'apartment/create',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/apartment/createapartment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.newApartment;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create apartment'
      );
    }
  }
);

// Update apartment
export const updateApartment = createAsyncThunk(
  'apartment/update',
  async ({ apartmentId, updatedData, isFormData = false }, thunkAPI) => {
    try {
      const headers = await getAuthHeaders(isFormData);
      const response = await axios.put(
        `${BASE_URL}/updateapartment/${apartmentId}`,
        updatedData,
        { headers }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update apartment'
      );
    }
  }
);

// Delete apartment
export const deleteApartment = createAsyncThunk(
  'apartment/delete',
  async (apartmentId, thunkAPI) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${BASE_URL}/deleteapartment/${apartmentId}`, {
        headers,
      });
      return { apartmentId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete apartment'
      );
    }
  }
);

// Slice
const apartmentSlice = createSlice({
  name: 'apartment',
  initialState: {
    apartments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filter
      .addCase(fetchFilteredApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      .addCase(fetchFilteredApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createApartment.fulfilled, (state, action) => {
        state.apartments.push(action.payload);
      })

      // Update
      .addCase(updateApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.apartments = state.apartments.map((apt) =>
          apt._id === updated._id ? updated : apt
        );
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = state.apartments.filter(
          (apt) => apt._id !== action.payload.apartmentId
        );
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default apartmentSlice.reducer;
