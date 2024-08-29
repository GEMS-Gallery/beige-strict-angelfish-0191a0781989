import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      await backend.createPost(newPost.title, newPost.body, newPost.author);
      setOpenDialog(false);
      setNewPost({ title: '', body: '', author: '' });
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Crypto Blog</Typography>
        </Toolbar>
      </AppBar>

      <div className="hero bg-cover bg-center h-64 flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1642465789831-a176eb4a1b14?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ5NzQxOTZ8&ixlib=rb-4.0.3')"}}>
        <Typography variant="h2" className="text-white text-shadow">Crypto Blog</Typography>
      </div>

      <Container className="mt-8">
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={Number(post.id)} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.body}
                  </Typography>
                  <Typography variant="caption" display="block" className="mt-2">
                    By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        className="fixed bottom-4 right-4"
        onClick={() => setOpenDialog(true)}
      >
        New Post
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            multiline
            rows={4}
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
