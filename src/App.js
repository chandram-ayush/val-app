import React, { useState, useRef } from 'react';
import './App.css';
import bgImage from './bg_val.jpg';
import successImage from './img2.jpeg'; 
import musicFile from './song.mp3';
import Game from './Game'; 

function App() {
  const [started, setStarted] = useState(false); 
  const [accepted, setAccepted] = useState(false);
  const [showGame, setShowGame] = useState(false); 
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

  if (showGame) {
    // PASS THE BACKGROUND IMAGE HERE
    return <Game onClose={() => setShowGame(false)} bgImage={bgImage} />;
  }

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
              <h1 className="neon-text">Hey Shraddha, will you be Chandram's valentine?</h1>
              
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
              <img 
                src={successImage} 
                alt="Valentine Celebration"
                className="img-style" 
              />
              <h1 className="neon-text">Please be my forever! ❤️</h1>
              
              {/* PINK THEMED BUTTON */}
              <button 
                className="btn" 
                onClick={() => setShowGame(true)}
                style={{
                  marginTop: '20px',
                  backgroundColor: '#ff4d88', // Pink to match theme
                  color: 'white',
                  border: '2px solid white',
                  fontSize: '1.2rem',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  boxShadow: '0 5px 15px rgba(255, 77, 136, 0.4)'
                }}
              >
                Let's Play a Game! 🎮
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;