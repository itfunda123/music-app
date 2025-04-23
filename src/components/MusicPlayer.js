import React, { useState } from 'react';
import { Container, Form, ListGroup, Button } from 'react-bootstrap';

function MusicPlayer() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);

  const searchSongs = async () => {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const baseURL = 'https://spotify23.p.rapidapi.com/search/';
    const url = `${corsProxy}${baseURL}?q=${encodeURIComponent(search)}&type=tracks&limit=10`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'spotify23.p.rapidapi.com',
          'x-rapidapi-key': 'YOUR_API_KEY_HERE', 
        },
      });

      const data = await res.json();
      setResults(data.tracks?.items || []);
    } catch (err) {
      console.error('Error fetching from Spotify API:', err);
    }
  };

  return (
    <Container className="mt-5">
      <h2>🎶 Spotify Stream Preview</h2>
      <Form.Control
        type="text"
        placeholder="Search for a song..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
        className="my-3"
      />
      <Button onClick={searchSongs} variant="primary" className="mb-3">
        Search
      </Button>

      <ListGroup>
        {results.map((track, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            {track.data?.name} - {track.data?.artists?.items[0]?.profile?.name}
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setCurrentPreview(track.data?.preview_url)}
            >
              ▶️ Play
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {currentPreview && (
        <div className="mt-4">
          <audio controls autoPlay src={currentPreview} style={{ width: '100%' }} />
        </div>
      )}
    </Container>
  );
}

export default MusicPlayer;
