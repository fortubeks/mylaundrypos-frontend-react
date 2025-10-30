import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService, Customer, CreateCustomerDto, PaginatedResponse } from '../../services/api';

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  } | null;
}

const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCustomers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const customer = await apiService.getCustomer(id);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch customer');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data: CreateCustomerDto, { rejectWithValue }) => {
    try {
      const customer = await apiService.createCustomer(data);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: number; data: Partial<CreateCustomerDto> }, { rejectWithValue }) => {
    try {
      const customer = await apiService.updateCustomer(id, data);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiService.deleteCustomer(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.currentCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<PaginatedResponse<Customer>>) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single customer
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.customers = state.customers.filter(c => c.id !== action.payload);
        if (state.currentCustomer?.id === action.payload) {
          state.currentCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;

