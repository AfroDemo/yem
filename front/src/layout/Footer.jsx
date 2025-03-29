import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Divider,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
      <Divider />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Youth Entrepreneur Mentorship
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting young entrepreneurs with experienced mentors to help build the future.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'For Mentees', path: '/for-mentees' },
                { name: 'For Mentors', path: '/for-mentors' },
              ].map((item) => (
                <Box key={item.name} sx={{ mb: 1 }}>
                  <Link 
                    component={RouterLink} 
                    to={item.path}
                    color="text.secondary"
                    underline="hover"
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Box>
              {[
                { name: 'Articles', path: '/resources/articles' },
                { name: 'Events', path: '/events' },
                { name: 'Success Stories', path: '/success-stories' },
                { name: 'FAQ', path: '/faq' },
              ].map((item) => (
                <Box key={item.name} sx={{ mb: 1 }}>
                  <Link 
                    component={RouterLink} 
                    to={item.path}
                    color="text.secondary"
                    underline="hover"
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Have questions or feedback? We'd love to hear from you.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/contact"
              variant="outlined" 
              size="small"
            >
              Contact Us
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Youth Entrepreneur Mentorship Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
