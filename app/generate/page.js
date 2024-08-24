'use client'

import { useUser } from "@clerk/nextjs"
import { Container, Typography, Box, Paper, TextField, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card } from "@mui/material"
import { collection, getDoc, writeBatch, doc } from "firebase/firestore"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/firebase"

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        setIsGenerating(true)
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => {
                setFlashcards(data)
                setIsGenerating(false)
            })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    } 

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return 
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.")
                return 
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="md">
                <Button
                    onClick={() => router.push('/')}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        borderRadius: 4,
                        padding: '8px 16px',
                        color:"black"
                    }}
                >
                    Home
                </Button>
                <Typography variant="h3" sx={{ mb: 4, padding: '20px', textAlign: 'center', fontWeight: 'bold', color: 'black', textShadow: '0px 0px 10px rgba(224,224,224,0.7)' }}>
                    Generate Flashcards
                </Typography>
                <Paper elevation={8} sx={{ p: 4, width: "100%", borderRadius: 4, background: 'lightgrey', boxShadow: '0px 8px 16px rgba(0,0,0,0.5)' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: 'lightgrey', color: 'black' }, '& .MuiInputLabel-root': { color: 'black' } }}
                    />
                    <Button
                        variant="contained"
                        color='primary'
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isGenerating}
                        sx={{
                            py: 1.5,
                            fontWeight: 'bold',
                            backgroundColor: isGenerating ? '#555' : '#0000FF',  // Blue background for the Submit button
                            transition: 'background-color 0.3s ease',
                            '&:hover': {
                                backgroundColor: isGenerating ? '#555' : '#0000CC',  // Darker blue for hover
                            },
                            borderRadius: '12px',
                        }}
                    >
                        {isGenerating ? 'Generating...' : 'Submit'}
                    </Button>
                </Paper>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: 'black' }}>Flashcards Preview</Typography>
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

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpen}
                            sx={{ borderRadius: 4, boxShadow: 8, background: '#0000FF', color: 'white', '&:hover': { background: '#0000CC' } }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#0000FF' }}>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, color: 'black' }}>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: 'red' }}>Cancel</Button>
                    <Button onClick={saveFlashcards} sx={{ color: 'blue' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
