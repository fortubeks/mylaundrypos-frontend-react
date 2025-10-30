import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Toolbar, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  LocationOn,
  People,
  Search,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  clearError,
} from '../store/slices/customerSlice';
import { CreateCustomerDto, Customer } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { AppSidebar, DRAWER_WIDTH } from '../components/AppSidebar';

const titleOptions = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'];

const Customers = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { customers, loading, error } = useAppSelector((state) => state.customers);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<CreateCustomerDto>({
    title: 'Mr',
    first_name: '',
    last_name: '',
    other_names: '',
    email: '',
    phone_code: '',
    phone: '',
    other_phone: '',
    birthday: '',
    address: '',
    state_id: undefined,
    country_id: undefined,
  });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      // Format birthday to YYYY-MM-DD for date input
      const formattedBirthday = customer.birthday 
        ? customer.birthday.split('T')[0] 
        : '';
      
      setFormData({
        title: customer.title,
        first_name: customer.first_name,
        last_name: customer.last_name || '',
        other_names: customer.other_names || '',
        email: customer.email || '',
        phone_code: customer.phone_code || '',
        phone: customer.phone,
        other_phone: customer.other_phone || '',
        birthday: formattedBirthday,
        address: customer.address || '',
        state_id: customer.state_id || undefined,
        country_id: customer.country_id || undefined,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        title: 'Mr',
        first_name: '',
        last_name: '',
        other_names: '',
        email: '',
        phone_code: '',
        phone: '',
        other_phone: '',
        birthday: '',
        address: '',
        state_id: undefined,
        country_id: undefined,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        await dispatch(updateCustomer({ id: editingCustomer.id, data: formData })).unwrap();
        setSnackbarMessage('Customer updated successfully');
      } else {
        await dispatch(createCustomer(formData)).unwrap();
        setSnackbarMessage('Customer created successfully');
      }
      setSnackbarOpen(true);
      handleCloseDialog();
      dispatch(fetchCustomers());
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Failed to save customer');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await dispatch(deleteCustomer(id)).unwrap();
        setSnackbarMessage('Customer deleted successfully');
        setSnackbarOpen(true);
        dispatch(fetchCustomers());
      } catch (error: any) {
        setSnackbarMessage(error.message || 'Failed to delete customer');
        setSnackbarOpen(true);
      }
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.first_name} ${customer.last_name || ''} ${customer.other_names || ''}`.toLowerCase();
    const email = customer.email?.toLowerCase() || '';
    const phone = customer.phone?.toLowerCase() || '';
    const address = customer.address?.toLowerCase() || '';
    const search = searchQuery.toLowerCase();
    
    return fullName.includes(search) || 
           email.includes(search) || 
           phone.includes(search) || 
           address.includes(search);
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppHeader
        user={user}
        onLogout={handleLogout}
        title="Customers"
        onDrawerToggle={handleDrawerToggle}
        actionButton={{
          label: 'Add Customer',
          icon: <Add />,
          onClick: () => handleOpenDialog(),
        }}
      />
      <AppSidebar
        user={user}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth={false} sx={{ mt: 3, mb: 3, px: { xs: 1, sm: 3 } }}>
          <Typography variant="caption" sx={{ color: '#7b809a', mb: 1, display: 'block' }}>
            Pages / Customers
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#344767' }}>
              Customer Management
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Search Filter */}
              {customers.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search customers by name, email, phone, or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: '#7b809a' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.12)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#008aff',
                        },
                      },
                    }}
                  />
                </Box>
              )}
              
              {loading && customers.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : customers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <People sx={{ fontSize: 64, color: '#7b809a', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#344767', mb: 1 }}>
                    No customers yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7b809a', mb: 3 }}>
                    Get started by adding your first customer
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      background: '#008aff',
                      color: 'white',
                      '&:hover': { background: '#0070cc' },
                    }}
                  >
                    Add Customer
                  </Button>
                </Box>
              ) : filteredCustomers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Search sx={{ fontSize: 64, color: '#7b809a', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#344767', mb: 1 }}>
                    No customers found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7b809a' }}>
                    Try adjusting your search query
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: '#344767' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#344767' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#344767' }}>Address</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#344767' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
                              {customer.title} {customer.first_name} {customer.last_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {customer.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Phone sx={{ fontSize: 16, color: '#7b809a' }} />
                                  <Typography variant="body2" sx={{ color: '#7b809a' }}>
                                    {customer.phone}
                                  </Typography>
                                </Box>
                              )}
                              {customer.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 16, color: '#7b809a' }} />
                                  <Typography variant="body2" sx={{ color: '#7b809a' }}>
                                    {customer.email}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {customer.address ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: '#7b809a' }} />
                                <Typography variant="body2" sx={{ color: '#7b809a' }}>
                                  {customer.address}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#7b809a' }}>
                                No address
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(customer)}
                                sx={{ color: '#008aff' }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(customer.id)}
                                sx={{ color: '#f44336' }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ width: { xs: '100%', sm: '30%' } }}
                select
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              >
                {titleOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                sx={{ width: { xs: '100%', sm: '70%' } }}
                label="First Name *"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                sx={{ flex: 1 }}
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              <TextField
                sx={{ flex: 1 }}
                label="Other Names"
                value={formData.other_names}
                onChange={(e) => setFormData({ ...formData, other_names: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                sx={{ flex: 1 }}
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                sx={{ flex: 1 }}
                type="date"
                label="Birthday"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ width: { xs: '100%', sm: '30%' } }}
                label="Phone Code"
                value={formData.phone_code}
                onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })}
                placeholder="+234"
              />
              <TextField
                sx={{ width: { xs: '100%', sm: '70%' } }}
                label="Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Other Phone"
              value={formData.other_phone}
              onChange={(e) => setFormData({ ...formData, other_phone: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.first_name || !formData.phone}
            sx={{
              background: '#008aff',
              color: 'white',
              '&:hover': { background: '#0070cc' },
            }}
          >
            {editingCustomer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;

