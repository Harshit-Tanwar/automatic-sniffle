
import { Box, Button, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'

const App = () => {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [error, setError] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone
      })
      setGeneratedReply(typeof response.data == 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Something went wrong. Please try again later');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant='h3' component='h1' gutterBottom sx={{ textAlign: "center", fontVariant: "all-petite-caps", color: "#ad5e00" }} >Email Reply Generator</Typography>
      <Box sx={{ mt: 2 }} bgcolor="#FBFBFB">
        <TextField
          label='Original Email Content'
          color="#FBFBFB"
          fullWidth
          multiline
          rows={5}
          variant='outlined'
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </Box>
      <FormControl fullWidth sx={{ mt: 2, bgcolor: "#FBFBFB" }}>
        <InputLabel>Tone (Optional)</InputLabel>
        <Select
          value={tone || ''}
          label={"Tone {Optional}"}
          onChange={(e) => setTone(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          <MenuItem value="Friendly">Friendly</MenuItem>
          <MenuItem value="Casual">Casual</MenuItem>
          <MenuItem value="Professional">Professional</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained' color='primary' fullWidth sx={{ mt: 2 }} onClick={handleSubmit} disabled={!emailContent || loading}>
        {loading ? <CircularProgress size={24}></CircularProgress> : 'Generate Reply'}
      </Button>
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>{error}</Typography>
      )}
      {generatedReply && (
        <Box sx={{ mt: 3 }}  >
          <Typography variant='h6' gutterBottom>Generated Reply
          </Typography>
          <TextField sx={{ bgcolor: "#FBFBFB" } }
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}>
          </TextField>
          <Button
            variant='outlined'
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}>Copy to Clipboard</Button>
        </Box>
      )}
    </Container>

  )
}

export default App