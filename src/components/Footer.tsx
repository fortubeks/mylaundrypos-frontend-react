import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()}, made with{' '}
            <span style={{ color: '#ff6b6b' }}>♥</span> by{' '}
            <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              Fortran House
            </a>
            {' '}for a better web.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <a href="/landing.html" style={{ color: 'white', textDecoration: 'none' }}>
              <Typography variant="caption">Home</Typography>
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <Typography variant="caption">About Us</Typography>
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <Typography variant="caption">Blog</Typography>
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <Typography variant="caption">License</Typography>
            </a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
