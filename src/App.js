import React, { useState, useRef } from 'react';
import './App.css';
import bgImage from './bg_val.jpg';
import videoFile from './success_val.mp4';
import musicFile from './song.mp3';

function App() {
  const [started, setStarted] = useState(false); 
  const [accepted, setAccepted] = useState(false);
  const [noBtnStyle, setNoBtnStyle] = useState({});
  const audioRef = useRef(null);

  // 1. AUDIO HANDLING
  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  // 2. NO BUTTON LOGIC (Mobile Safe Version)
  const handleNoClick = () => {
    // START FIX: Strict "No-Overlap" Logic
    
    // We define two "Safe Zones" (Top 20% and Bottom 20%)
    // The Middle 60% is completely banned.
    const safeZones = [
      { min: 5, max: 25 },  // Top area (5% to 25% down the screen)
      { min: 120, max: 150 }  // Bottom area (75% to 100% down the screen)
    ];

    // Pick one zone randomly (Top or Bottom)
    const randomZone = safeZones[Math.floor(Math.random() * safeZones.length)];

    // Calculate random Top position within that safe zone
    const randomTop = Math.floor(Math.random() * (randomZone.max - randomZone.min)) + randomZone.min;

    // Calculate random Left position (5% to 85% to avoid edge clipping)
    const randomLeft = Math.floor(Math.random() * 80) + 5;

    setNoBtnStyle({
      position: 'absolute',
      left: `${randomLeft}%`,
      top: `${randomTop}%`,
      transition: 'all 0.3s ease', // Smooth glide
    });
    // END FIX
  };

  // 3. YES BUTTON LOGIC
  const handleYesClick = () => {
    setAccepted(true);
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay"></div>
      
      <audio ref={audioRef} src={musicFile} loop />

      <div className="content">
        {!started ? (
          <button className="btn start-btn" onClick={handleStart}>
            Tap to Open ❤️
          </button>
        ) : (
          !accepted ? (
            <>
              <h1 className="neon-text">Hey Shraddha, will you be my valentine?</h1>
              
              <div className="button-group">
                <button className="btn yes-btn" onClick={handleYesClick}>
                  YES
                </button>
                
                <button 
                  className="btn no-btn" 
                  style={noBtnStyle} 
                  onClick={handleNoClick}
                  onMouseEnter={handleNoClick} 
                  onTouchStart={handleNoClick} 
                >
                  NO
                </button>
              </div>
            </>
          ) : (
            <div className="success-container">
              <video 
                src={videoFile} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="video-style" 
              />
              <h1 className="neon-text">Please wait till 22nd Feb! ❤️</h1>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;