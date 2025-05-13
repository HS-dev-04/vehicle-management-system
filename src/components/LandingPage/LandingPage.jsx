import React from 'react';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box} from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
const Landing = () => {
  const navigate = useNavigate();  
  const HeroSection = styled(Box)(({ theme }) => ({
    height: '100vh',
    backgroundImage: 'url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
  }));

  const HeroContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: theme.spacing(4),
    maxWidth: '800px',
    color:'white'
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
        
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            RESERVE NOW
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit"  onClick={() => navigate('/signup')}>Buyer</Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>Seller</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ 
                backgroundColor: '#ff5722',
                '&:hover': { backgroundColor: '#e64a19' }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <HeroSection>
        <HeroContent>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            RESERVE NOW & Get 50% Off
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
            WELCOME
          </Typography>
          <Link to="/signup">
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              backgroundColor: '#ff5722',
              padding: '12px 36px',
              fontSize: '1.1rem',
              '&:hover': { 
                backgroundColor: '#e64a19',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
           
            RESERVE NOW
          
          </Button>
          </Link>
        </HeroContent>
      </HeroSection>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 4, 
        p: 8,
        backgroundColor: '#f5f5f5'
      }}>
      </Box>
    </Box>
  );
};

export default Landing;