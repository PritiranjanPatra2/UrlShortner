import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!originalUrl.trim()) {
      setError("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:9192/add", {
        originalUrl,
      });
      setShortUrl(response.data.shortUrl);
      setOriginalUrl("");
    } catch (err) {
      setError("An error occurred while shortening the URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <header className="header">
      <div className="logo-container">
          <div className="logo">
            <span className="logo-highlight">Short</span>iFy
          </div>
        </div>
        <div className="nav">
          <button className="nav-button">Login</button>
          <button className="nav-button register">Register</button>
        </div>
      </header>
      <div className="app-container">
        <div className="content">
          <h1>Shorten URLs and earn money</h1>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Your URL Here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {shortUrl && !loading && (
            <div className="result">
              <p>Shortened URL:</p>
              <a className="short-url" href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
};

export default App;
