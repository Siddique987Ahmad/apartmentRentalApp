import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const fetchApartments = createAsyncThunk(
  'apartment/fetchApartments',
  async ({ role, userId }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("token", token);

      const response = await axios.get('http://192.168.70.67:4001/api/apartment/getallapartments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role,
          userId,
        },
      });
      console.log("API Response Data:", response.data);  // Add this line
      console.log("Fetched Apartments:", response.data.allApartments);
      return response.data;
    } catch (error) {
      console.error("Error fetching apartments", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch apartments"
      );
    }
  }
);
export const fetchFilteredApartments = createAsyncThunk(
  'apartment/fetchFilteredApartments',
  async ({ minPrice, maxPrice, location, search }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.get('http://192.168.70.67:4001/api/apartment/getfilteredapartments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          minPrice,
          maxPrice,
          location,
          search,
        },
      });
      console.log("filtered apartment data",response.data)
      return response.data; // array of apartments
    } catch (error) {
      console.error("Error filtering apartments:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to filter apartments"
      );
    }
  }
);

export const createApartment = createAsyncThunk(
    'apartment/createApartment',
    async (formData, thunkAPI) => {
      try {
        const res = await api.post('/apartment/createapartment', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.data.newApartment;
      } catch (error) {
        console.log('CreateApartment Axios Error:', {
          message: error.message,
          responseData: error.response?.data,
          status: error.response?.status,
        });
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to create apartment'
        );
      }
    }
  );
  export const updateApartment = createAsyncThunk(
    'apartment/updateApartment',
    async ({ apartmentId, updatedData }, thunkAPI) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
  
        const response = await axios.put(
          `http://192.168.70.67:4001/api/apartment/updateapartment/${apartmentId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
         console.log("data update",response.data)
        return response.data; // the updated apartment
      } catch (error) {
        console.error("Error updating apartment:", error);
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to update apartment'
        );
      }
    }
  );
  export const deleteApartment = createAsyncThunk(
    'apartment/deleteApartment',
    async (apartmentId, thunkAPI) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.delete(
          `http://192.168.70.67:4001/api/apartment/deleteapartment/${apartmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return { apartmentId };
      } catch (error) {
        console.error("Error deleting apartment:", error);
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to delete apartment"
        );
      }
    }
  );  
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
      .addCase(createApartment.fulfilled, (state, action) => {
        state.apartments = [...state.apartments, action.payload];
      })
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
      .addCase(updateApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })      
      .addCase(updateApartment.fulfilled, (state, action) => {
        const updatedApartment = action.payload;
        state.apartments = state.apartments.map((apt) =>
          apt._id === updatedApartment._id ? updatedApartment : apt
        );
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.loading = false;
        const { apartmentId } = action.payload;
        state.apartments = state.apartments.filter(
          (apt) => apt._id !== apartmentId
        );
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });      
  },
});

export default apartmentSlice.reducer;
