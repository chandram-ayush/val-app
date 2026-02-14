import React, { useState, useRef } from 'react';
import './App.css';
import bgImage from './bg_val.jpg';
import successImage from './img1.jpeg'; // Renamed for clarity
import musicFile from './audio1.mpeg';

function App() {
  const [started, setStarted] = useState(false); 
  const [accepted, setAccepted] = useState(false);
  const [noBtnStyle, setNoBtnStyle] = useState({});
  const audioRef = useRef(null);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  const handleNoClick = () => {
    const safeZones = [
      { min: 5, max: 25 },
      { min: 120, max: 150 }
    ];
    const randomZone = safeZones[Math.floor(Math.random() * safeZones.length)];
    const randomTop = Math.floor(Math.random() * (randomZone.max - randomZone.min)) + randomZone.min;
    const randomLeft = Math.floor(Math.random() * 80) + 5;

    setNoBtnStyle({
      position: 'absolute',
      left: `${randomLeft}%`,
      top: `${randomTop}%`,
      transition: 'all 0.3s ease',
    });
  };

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
              <h1 className="neon-text">Hey Pratik, will you be Arushi's valentine?</h1>
              
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
              {/* CHANGED FROM <video> TO <img> */}
              <img 
                src={successImage} 
                alt="Valentine Celebration"
                className="img-style" 
              />
              <h1 className="neon-text">Please be my forever! ❤️</h1>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;