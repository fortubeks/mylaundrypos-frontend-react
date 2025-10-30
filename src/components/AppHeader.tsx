import { 
  AppBar, 
  Toolbar, 
  IconButton,
  Avatar,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon, Add } from '@mui/icons-material';

interface AppHeaderProps {
  user: {
    name?: string;
    email?: string;
  } | null;
  onLogout: () => void;
  title: string;
  drawerWidth?: number;
  onDrawerToggle?: () => void;
  actionButton?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

export const AppHeader = ({ 
  user, 
  onLogout, 
  title, 
  drawerWidth = 240,
  onDrawerToggle,
  actionButton,
}: AppHeaderProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'white',
        color: '#000',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <Toolbar>
        {onDrawerToggle && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600, color: '#344767' }}>
          {title}
        </Typography>
        {actionButton && (
          <Button
            variant="contained"
            startIcon={actionButton.icon || <Add />}
            onClick={actionButton.onClick}
            sx={{
              background: '#008aff',
              color: 'white',
              '&:hover': { background: '#0070cc' },
            }}
          >
            {actionButton.label}
          </Button>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
          <Avatar sx={{ bgcolor: '#008aff', width: 40, height: 40 }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

