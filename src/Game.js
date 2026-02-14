import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import playerImg from './runner.jpeg';
import chaserImg from './chaser.jpeg';
import obstacleImg from './runner.jpeg';

// ADD bgImage to props
const Game = ({ onClose, bgImage }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const playerRef = useRef(null);
  const obstacleRef = useRef(null);
  const scoreInterval = useRef(null);

  const jump = () => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 800); // Increased jump time slightly for slower feel
    }
  };

  useEffect(() => {
    const detectCollision = setInterval(() => {
      if (gameOver) return;

      const player = playerRef.current;
      const obstacle = obstacleRef.current;

      if (player && obstacle) {
        const playerTop = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        // Collision Logic
        if (obstacleLeft > 0 && obstacleLeft < 60 && playerTop >= 250) {
          setGameOver(true);
          clearInterval(scoreInterval.current);
        }
      }
    }, 10);

    scoreInterval.current = setInterval(() => {
      if (!gameOver) {
        setScore((prev) => prev + 1);
      }
    }, 100);

    return () => {
      clearInterval(detectCollision);
      clearInterval(scoreInterval.current);
    };
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
      }
    };
    
    const handleTouch = () => {
        jump();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isJumping, gameOver]);

  return (
    // USE THE BACKGROUND IMAGE HERE
    <div className="game-container" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Dark overlay to make game elements pop */}
      <div className="game-overlay"></div> 
      
      <h2 className="score">Score: {score}</h2>
      
      <div className="game-area">
        <img 
            src={chaserImg} 
            alt="Chaser" 
            className={`chaser ${gameOver ? 'caught' : 'run-animation'}`} 
        />

        <img 
          ref={playerRef}
          src={playerImg} 
          alt="Player" 
          className={`player ${isJumping ? 'animate-jump' : 'run-animation'}`} 
        />

        <img 
          ref={obstacleRef}
          src={obstacleImg} 
          alt="Obstacle" 
          className={`obstacle ${gameOver ? 'stop-animation' : ''}`} 
        />
      </div>

      {gameOver && (
        <div className="game-over-screen">
          <h1>Game Over!</h1>
          <p>Score: {score}</p>
          <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
          <button className="btn close-btn" onClick={onClose}>Close Game</button>
        </div>
      )}
    </div>
  );
};

export default Game;