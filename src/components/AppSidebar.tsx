import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PointOfSale,
  People,
  Inventory,
  Receipt,
  ShowChart,
  Settings,
  Payment,
  Menu as MenuIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { icon: <DashboardIcon />, text: 'Dashboard', path: '/dashboard' },
  { icon: <PointOfSale />, text: 'POS / Orders', path: '/orders' },
  { icon: <People />, text: 'Customers', path: '/customers' },
  { icon: <Inventory />, text: 'Products & Pricing', path: '/products' },
  { icon: <Payment />, text: 'Payments', path: '/payments' },
  { icon: <Receipt />, text: 'Invoices', path: '/invoices' },
  { icon: <ShowChart />, text: 'Reports', path: '/reports' },
  { icon: <Settings />, text: 'Settings', path: '/settings' },
];

interface AppSidebarProps {
  user: {
    name?: string;
    email?: string;
  } | null;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

export const AppSidebar = ({ user, mobileOpen, onDrawerToggle }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>
      <Toolbar sx={{ bgcolor: '#0d1117', color: 'white', justifyContent: 'flex-start', py: 2, px: 2 }}>
        <Box component="img" 
          src="/logos/green-blue-text.png" 
          alt="Laundry POS Logo"
          sx={{ 
            height: 48,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                bgcolor: location.pathname === item.path ? '#008aff' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ color: 'white', mb: 0.5, fontWeight: 600 }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {user?.email || ''}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            bgcolor: '#0d1117',
            color: 'white',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            bgcolor: '#0d1117',
            color: 'white',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export { DRAWER_WIDTH };

