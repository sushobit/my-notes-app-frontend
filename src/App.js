import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, AppBar, Toolbar, Typography, IconButton, TextField, Button, Card, CardContent, CardActions, Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Save as SaveIcon, List as ListIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material';
import './App.css';

const drawerWidth = 240;

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    try {
      await axios.post('http://localhost:5000/notes', { content: note });
      setNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {['Notes', 'Add Note'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <ListIcon /> : <SaveIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#db4e21' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Pacifico, cursive' }}>
            Note Taking App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Pacifico, cursive', color: '#4caf50' }}>
          Add a New Note
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Write your note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveNote}
            sx={{ mt: 2, backgroundColor: '#4caf50', color: '#ffffff', '&:hover': { backgroundColor: '#388e3c' } }}
          >
            Save Note
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Pacifico, cursive', color: '#db4e21' }}>
          Notes
        </Typography>
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ backgroundColor: '#ffe0b2', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>{note.content}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteNote(note.id)}
                    sx={{ color: '#d32f2f' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
