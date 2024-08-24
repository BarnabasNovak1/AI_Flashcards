'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams, useRouter } from "next/navigation"
import { Container, Typography, Box, Grid, CardActionArea, CardContent, Card, Button } from "@mui/material"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleBackToFlashcards = () => {
        router.push('/flashcards')
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="md">
            <Button
                onClick={handleBackToFlashcards}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    borderRadius: 4,
                    padding: '8px 16px',
                    color: 'black',
                }}
            >
                Flashcards
            </Button>
            <Grid container spacing={5} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={5} md={4} key={index}>
                        <Card sx={{ borderRadius: 4, backgroundColor: 'white' }}>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '200px',
                                            transform: flipped[index]
                                                ? 'rotateY(180deg)'
                                                : 'rotateY(0deg)',
                                        },
                                    }}>
                                        <div>
                                            {/* Front Side */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '16px',
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'lightgrey', // Darker background color
                                                }}
                                            >
                                                <Typography variant="h5" component="div" sx={{ color: 'black' }}>
                                                    {flashcard.front}
                                                </Typography>
                                            </div>

                                            {/* Back Side */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '16px',
                                                    boxSizing: 'border-box',
                                                    backgroundColor: 'lightblue', // Slightly lighter than the front side
                                                    transform: 'rotateY(180deg)',
                                                }}
                                            >
                                                <Typography variant="h5" component="div" sx={{ color: 'black' }}>
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
