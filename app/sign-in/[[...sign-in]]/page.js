import { SignIn } from '@clerk/nextjs';
import { Button, AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';

export default function SignInPage() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        padding: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5', // Light grey background for a softer look
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7,
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="sm">
        <Head>
          <title>Sign In - Flashcard SaaS</title>
          <meta name="description" content="Sign in to your Flashcard SaaS account" />
          <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Dancing+Script&display=swap" rel="stylesheet" />
        </Head>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 4, textAlign: 'center' }} 
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#3f51b5', // Primary color for a fresh look
              mb: 2, // Margin bottom for spacing
              fontFamily: 'Lobster, cursive', // Font style for a unique touch
            }}
          >
            Sign In
          </Typography>
          <SignIn routing="hash" />
        </Box>
      </Container>
    </Box>
  );
}
