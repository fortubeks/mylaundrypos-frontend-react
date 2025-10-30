import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/slices/authSlice';
import Footer from '../components/Footer';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [validationError, setValidationError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.password_confirmation) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(52, 71, 103, 0.6)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            animation: 'fadeIn 0.6s ease-in-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
              overflow: 'visible',
              position: 'relative',
              mt: 3,
            }}
          >
            {/* Card Header - extends beyond card */}
            <Box
              sx={{
                position: 'absolute',
                top: -25,
                left: 0,
                right: 0,
                mx: 3,
              }}
            >
              <Box
                sx={{
                  background: '#0d1117',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(52, 71, 103, 0.4)',
                  py: 2,
                  px: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50px',
                  }}
                >
                  Sign up
                </Typography>

                {/* Social login buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    <i className="fa fa-facebook" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    <i className="fa fa-github" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    <i className="fa fa-google" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Card Content */}
            <CardContent sx={{ pt: 10, px: 3 }}>
              {(error || validationError) && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => {
                    dispatch(clearError());
                    setValidationError('');
                  }}
                >
                  {error || validationError}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                  autoComplete="name"
                  variant="outlined"
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                  autoComplete="email"
                  variant="outlined"
                  size="small"
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                    autoComplete="new-password"
                    variant="outlined"
                    size="small"
                    helperText="At least 8 characters"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    margin="normal"
                    autoComplete="new-password"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    background: '#008aff',
                    color: 'white',
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    mt: 3,
                    boxShadow: '0 4px 20px 0 rgba(0, 138, 255, 0.3), 0 7px 10px -5px rgba(0, 138, 255, 0.2)',
                    '&:hover': {
                      background: '#0070cc',
                      boxShadow: '0 4px 20px 0 rgba(0, 138, 255, 0.3), 0 7px 10px -5px rgba(0, 138, 255, 0.2)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    style={{
                      color: '#17c100',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default SignUp;
