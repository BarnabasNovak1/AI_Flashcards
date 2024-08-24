'use client';

import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button, Container, Typography, Box, Stack } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter(); 

    const handleSubmit = async (plan) => {
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const checkoutSessionJson = await response.json();

            const stripe = await getStripe();

            const { error } = await stripe.redirectToCheckout({
                sessionId: checkoutSessionJson.id,
            });

            if (error) {
                console.warn(error.message);
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                padding: 0,
                overflow: 'hidden',
                backgroundColor: '#fafafa',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'black',
                    backgroundImage: 'url(/image.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.5,
                    zIndex: -1,
                }
            }}
        >
            <Container maxWidth="lg">
                <Head>
                    <title>Flashcard SaaS</title>
                    <meta name="description" content="Create flashcards from your text" />
                </Head>
                <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ mt: 2, mb: 4 }}>
                    <SignedOut>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#007bff', // Primary blue
                                '&:hover': {
                                    bgcolor: '#0056b3', // Darker blue
                                },
                            }}
                            href="/sign-in"
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#007bff', // Primary blue
                                '&:hover': {
                                    bgcolor: '#0056b3', // Darker blue
                                },
                            }}
                            href="/sign-up"
                        >
                            Sign Up
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Stack>
                <Box sx={{ textAlign: 'center', my: 6 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Roboto' }}
                    >
                        <span style={{ color: '#007bff' }}>Custom</span>
                        <span style={{ color: '#ff5722' }}> AI </span>
                        <span style={{ color: '#333333' }}>Flashcards</span>
                    </Typography>
                    <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                            color: '#555555',
                            fontFamily: 'Arial',
                            fontWeight: 300,
                            fontSize: '1.5rem',
                            lineHeight: 1.6,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Effortless Learning
                        <br />
                        Elevate Your Learning with Smart Flashcards
                        <br />
                        Unlock Knowledge Anytime, Anywhere
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            sx={{
                                padding: '12px 24px',
                                fontSize: '1.2rem',
                                minWidth: '150px',
                                bgcolor: '#007bff', // Primary blue
                                '&:hover': {
                                    bgcolor: '#0056b3', // Darker blue
                                },
                            }}
                            href="/generate"
                        >
                            Create Now
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                padding: '12px 24px',
                                fontSize: '1.2rem',
                                minWidth: '150px',
                                borderColor: '#007bff', // Primary blue
                                color: '#007bff',
                                '&:hover': {
                                    borderColor: '#0056b3', // Darker blue
                                    color: '#0056b3',
                                },
                            }}
                            href="/flashcards"
                        >
                            Flashcards
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
