import React, { useState } from 'react';
import { Container, Form, ListGroup, Button, Alert } from 'react-bootstrap';

function MusicPlayer() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [error, setError] = useState('');

  const searchSongs = async () => {
    if (!search.trim()) return;

    const deezerURL = `https://api.deezer.com/search?q=${encodeURIComponent(search)}`;
    const proxyURL = `https://api.allorigins.win/raw?url=${encodeURIComponent(deezerURL)}`;

    try {
      const res = await fetch(proxyURL);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setResults(data.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not reach Deezer API (CORS error or network issue).');
    }
  };

  return (
    <Container className="mt-5">
      <h2>🎶 Deezer Music Streamer</h2>
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

      {error && <Alert variant="danger">{error}</Alert>}

      <ListGroup>
        {results.map((track, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            {track.title} - {track.artist.name}
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setCurrentPreview(track.preview)}
              disabled={!track.preview}
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
