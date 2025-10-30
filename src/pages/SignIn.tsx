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
  Switch,
  FormControlLabel,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import Footer from '../components/Footer';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
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
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
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
              maxWidth: 400,
              mx: 'auto',
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
                  Sign in
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
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  autoComplete="current-password"
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    },
                  }}
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

                <FormControlLabel
                  control={
                    <Switch
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                  }
                  label="Remember me"
                  sx={{ mt: 2, mb: 3 }}
                />

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
                    boxShadow: '0 4px 20px 0 rgba(0, 138, 255, 0.3), 0 7px 10px -5px rgba(0, 138, 255, 0.2)',
                    '&:hover': {
                      background: '#0070cc',
                      boxShadow: '0 4px 20px 0 rgba(0, 138, 255, 0.3), 0 7px 10px -5px rgba(0, 138, 255, 0.2)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#17c100',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign up
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

export default SignIn;
