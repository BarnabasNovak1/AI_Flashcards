'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import HomeIcon from '@mui/icons-material/Home';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Button } from "@mui/material"

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return 
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="md">
            <Button
                color="primary"
                onClick={() => router.push('/')} // Navigate to home
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    borderRadius: 4,
                    padding: '8px 16px',
                    color: 'black'
                }}
            >
                Home
            </Button>
            <Typography variant="h3" sx={{ mb: 4, padding: '20px', textAlign: 'center', fontWeight: 'bold', color: 'black', textShadow: '0px 0px 10px rgba(224,224,224,0.7)' }}>
                    Flashcards
                </Typography>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{
                            color: 'black',
                            borderRadius: 4,
                            boxShadow: 8,
                            '&:hover': {
                                backgroundColor: 'lightgrey',
                                cursor: 'pointer'
                            }
                        }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h5" component="div" sx={{ color: 'black' }}>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
