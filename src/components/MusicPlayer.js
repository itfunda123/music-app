import React, { useState } from 'react';
import { Container, Form, ListGroup, Button } from 'react-bootstrap';

function MusicPlayer() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);

  const searchSongs = async () => {
    const res = await fetch(`https://api.deezer.com/search?q=${search}`);
    const data = await res.json();
    setResults(data.data || []);
  };

  return (
    <Container className="mt-5">
      <h2>🎶 Stream Music Preview</h2>
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
            {track.title} - {track.artist.name}
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setCurrentPreview(track.preview)}
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
