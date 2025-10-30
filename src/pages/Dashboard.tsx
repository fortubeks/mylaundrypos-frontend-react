import { useState } from 'react';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Toolbar,
  Avatar,
  Button, 
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { 
  AttachMoney,
  ShoppingCart,
  Assessment,
  TrendingUp,
  Notifications,
  Code,
  ShoppingCartOutlined,
  CreditCard,
  Lock,
  AccountBalance,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { AppHeader } from '../components/AppHeader';
import { AppSidebar, DRAWER_WIDTH } from '../components/AppSidebar';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const statsCards = [
    { 
      title: "Today's Revenue", 
      value: '₦53k', 
      change: '+55% than last week',
      changeColor: '#17c100',
      icon: <AttachMoney />,
      iconBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    },
    { 
      title: "Active Orders", 
      value: '23', 
      change: '+3% than last month',
      changeColor: '#17c100',
      icon: <ShoppingCart />,
      iconBg: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)'
    },
    { 
      title: 'Completed Orders', 
      value: '156', 
      change: '-2% than yesterday',
      changeColor: '#f44336',
      icon: <Assessment />,
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
    },
      { 
        title: 'Total Customers', 
        value: '1,234', 
        change: '+5% than yesterday',
        changeColor: '#17c100',
        icon: <ShoppingCartOutlined />,
        iconBg: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)'
      },
    ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppHeader
        user={user}
        onLogout={handleLogout}
        title="Dashboard"
        onDrawerToggle={handleDrawerToggle}
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
          overflow: 'hidden'
        }}
      >
        <Toolbar />
        <Container maxWidth={false} sx={{ mt: 3, mb: 3, px: { xs: 1, sm: 3 }, overflow: 'hidden' }}>
          <Typography variant="caption" sx={{ color: '#7b809a', mb: 1, display: 'block' }}>
            Pages / Dashboard
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#344767', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#7b809a', mb: 3 }}>
            Check the sales, value and bounce rate by country.
          </Typography>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, mb: 3 }}>
            {statsCards.map((stat) => (
              <Box key={stat.title} sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' },
                minWidth: { xs: 'calc(50% - 4px)', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }
              }}>
                <Card 
                  sx={{ 
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#7b809a', mb: 0.5, display: 'block', fontWeight: 700, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: { xs: 40, sm: 48 },
                        height: { xs: 35, sm: 42 },
                        borderRadius: 2,
                        background: stat.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px 0 rgba(0,0,0,0.1)',
                        flexShrink: 0
                      }}>
                        {stat.icon && (
                          <Box sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }}>
                            {stat.icon}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: { xs: 1, sm: 1.5 }, pt: 0, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp sx={{ fontSize: { xs: 12, sm: 14 }, color: stat.changeColor }} />
                      <Typography variant="caption" sx={{ color: stat.changeColor, fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Quick Actions */}
          <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 1 }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" sx={{ color: '#7b809a', mb: 3 }}>
                Use the buttons below to quickly navigate to common tasks.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #17c100 0%, #11a000 100%)',
                    color: 'white',
                    py: 1,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #11a000 0%, #0d8000 100%)',
                    },
                  }}
                >
                  Create New Sale
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #008aff 0%, #0070cc 100%)',
                    color: 'white',
                    py: 1,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0070cc 0%, #0056a3 100%)',
                    },
                  }}
                >
                  View Sales
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #ff9800 0%, #e68900 100%)',
                    color: 'white',
                    py: 1,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e68900 0%, #cc7700 100%)',
                    },
                  }}
                >
                  View Customers
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
                    color: 'white',
                    py: 1,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e53935 0%, #d32f2f 100%)',
                    },
                  }}
                >
                  Service Items
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Chart Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' }, minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 12px)' } }}>
              {/* Weekly Orders Card */}
              <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344767', mb: 1, fontSize: '0.95rem' }}>
                Weekly Orders
              </Typography>
                  <Typography variant="body2" sx={{ color: '#7b809a', mb: 2 }}>
                    Orders received this week
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Bar
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [
                          {
                            label: 'Orders',
                            data: [30, 40, 25, 50, 55, 60, 70],
                            backgroundColor: '#17c100',
                            borderRadius: 8,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              stepSize: 25,
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#7b809a' }}>
                      Orders processed 2 days ago
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' }, minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 12px)' } }}>
              {/* Monthly Revenue Card */}
              <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344767', mb: 1, fontSize: '0.95rem' }}>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7b809a', mb: 2 }}>
                    (+15%) increase in this month's revenue.
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Line
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                          {
                            label: 'Revenue',
                            data: [150, 180, 100, 420, 300, 250, 350, 280, 120, 300, 320, 200],
                            borderColor: '#17c100',
                            backgroundColor: 'rgba(23, 193, 0, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 600,
                            ticks: {
                              stepSize: 200,
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#7b809a' }}>
                      updated 4 min ago
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Service Completion Rate Card */}
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 100%', md: '1 1 calc(33.333% - 12px)' }, minWidth: { xs: '100%', sm: '100%', md: 'calc(33.333% - 12px)' } }}>
                  <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344767', mb: 1, fontSize: '0.95rem' }}>
                        Service Completion Rate
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7b809a', mb: 2 }}>
                        Services completed this year
                      </Typography>
                      <Box sx={{ height: 200 }}>
                        <Line
                          data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                            datasets: [
                              {
                                label: 'Services',
                                data: [50, 80, 150, 200, 500, 400, 350, 220, 500],
                                borderColor: '#17c100',
                                backgroundColor: 'rgba(23, 193, 0, 0.1)',
                                fill: true,
                                tension: 0.4,
                                pointRadius: 0,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 600,
                                ticks: {
                                  stepSize: 200,
                                },
                                grid: {
                                  color: 'rgba(0, 0, 0, 0.05)',
                                },
                              },
                              x: {
                                grid: {
                                  display: false,
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: '#7b809a' }}>
                          just updated
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
            </Box>
          </Box>

          {/* Projects and Orders Overview Section */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, mt: 3 }}>
            {/* Service Categories Section */}
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 8px)' }, minWidth: { xs: '100%', lg: 'calc(66.666% - 8px)' } }}>
              <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344767', mb: 0.5, fontSize: '0.95rem' }}>
                        Service Categories
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7b809a' }}>
                        30 services completed this month
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Table */}
                  <Box sx={{ overflowX: 'auto', px: { xs: 0, sm: 2 } }}>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      color: '#7b809a', 
                      fontWeight: 700, 
                      mb: 1.5,
                      textTransform: 'uppercase',
                      fontSize: '0.65rem',
                      letterSpacing: '0.5px'
                    }}>
                      Service, Staff, Price, Completion
                    </Typography>
                    
                    {/* Services List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { name: 'Wash & Fold Service', service: 'WF', serviceColor: '#9c27b0', price: '₦2,500', completion: 60, staff: 3 },
                        { name: 'Dry Cleaning', service: 'DC', serviceColor: '#1976d2', price: '₦1,800', completion: 10, staff: 2 },
                        { name: 'Ironing Service', service: 'IR', serviceColor: '#00acc1', price: '₦800', completion: 100, staff: 2 },
                        { name: 'Express Wash', service: 'EX', serviceColor: '#4caf50', price: '₦3,200', completion: 100, staff: 3 },
                        { name: 'Bulk Laundry', service: 'BL', serviceColor: '#2196f3', price: '₦5,000', completion: 25, staff: 1 },
                        { name: 'Stain Removal', service: 'SR', serviceColor: '#f44336', price: '₦1,200', completion: 40, staff: 2 },
                      ].map((service, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2,
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          pb: 2,
                          borderBottom: index < 5 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: { xs: 'none', sm: '0 0 40%' }, width: { xs: '100%', sm: 'auto' } }}>
                            <Box sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: 2, 
                              bgcolor: service.serviceColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              flexShrink: 0
                            }}>
                              {service.service}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {service.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: -0.5, flex: { xs: 'none', sm: '0 0 15%' }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                            {Array.from({ length: service.staff }, (_, i) => (
                              <Avatar key={i} sx={{ 
                                width: 32, 
                                height: 32, 
                                ml: i > 0 ? -1 : 0,
                                bgcolor: ['#e91e63', '#2196f3', '#ff9800'][i % 3]
                              }}>
                                {String.fromCharCode(65 + i)}
                              </Avatar>
                            ))}
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: '#7b809a', fontWeight: 600, textAlign: { xs: 'left', sm: 'center' }, minWidth: 80, flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>
                            {service.price}
                          </Typography>
                          
                          <Box sx={{ flex: { xs: 'none', sm: '0 0 25%' }, width: { xs: '100%', sm: 'auto' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#344767', fontWeight: 600 }}>
                                {service.completion}%
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              width: '100%', 
                              height: 6, 
                              borderRadius: 3, 
                              bgcolor: 'rgba(0,0,0,0.08)',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${service.completion}%`,
                                height: '100%',
                                bgcolor: service.completion === 100 ? '#17c100' : '#008aff',
                                borderRadius: 3
                              }} />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Recent Orders Section */}
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 8px)' }, minWidth: { xs: '100%', lg: 'calc(33.333% - 8px)' } }}>
              <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344767', mb: 0.5, fontSize: '0.95rem' }}>
                        Recent Orders
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7b809a' }}>
                        24% increase this month
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Timeline */}
                  <Box sx={{ position: 'relative', px: { xs: 0, sm: 2 } }}>
                    {[
                      { icon: <Notifications />, text: '₦2,400, Dry cleaning completed', date: '22 DEC 7:20 PM', color: '#17c100', iconBg: '#17c10015' },
                      { icon: <Code />, text: 'New order #LA1832412', date: '21 DEC 11 PM', color: '#f44336', iconBg: '#f4433615' },
                      { icon: <ShoppingCartOutlined />, text: 'Payment received for Order #LA4395133', date: '21 DEC 9:34 PM', color: '#2196f3', iconBg: '#2196f315' },
                      { icon: <CreditCard />, text: 'Express wash order #LA4395133', date: '20 DEC 2:20 AM', color: '#ff9800', iconBg: '#ff980015' },
                      { icon: <Lock />, text: 'Order #LA9583120 ready for pickup', date: '18 DEC 4:54 AM', color: '#e91e63', iconBg: '#e91e6315' },
                      { icon: <AccountBalance />, text: 'New bulk order #LA9583120', date: '17 DEC', color: '#9e9e9e', iconBg: '#9e9e9e15' },
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mb: 2.5,
                        position: 'relative',
                        '&::after': index < 5 ? {
                          content: '""',
                          position: 'absolute',
                          left: 8,
                          top: 28,
                          bottom: -20,
                          width: 2,
                          bgcolor: 'rgba(0,0,0,0.08)'
                        } : {}
                      }}>
                        <Box sx={{ 
                          minWidth: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: item.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}>
                          <Box sx={{ color: item.color, fontSize: 18 }}>
                            {item.icon}
                          </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767', mb: 0.5 }}>
                            {item.text}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7b809a' }}>
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
