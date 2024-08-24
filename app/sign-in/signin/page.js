import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm">
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#282c34' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#ffffff' }}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit">
            <Link href="/login" passHref>
              <Typography sx={{ color: '#ffffff' }}>Login</Typography>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sign-Up Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: 'center', my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333333', fontWeight: 'bold' }}>
          Sign Up
        </Typography>
        <SignUp />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#555555' }}>
            Already have an account?{' '}
            <Link href="/login" passHref>
              <Typography sx={{ color: '#007bff', fontWeight: 'bold' }}>Log in here</Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
