import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import playerImg from './runner.jpeg';
import chaserImg from './chaser.jpeg';
import obstacleImg from './runner.jpeg';

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
      }, 800); 
    }
  };

  // --- NEW: Reset Game without reloading the page ---
  const resetGame = () => {
    setGameOver(false);
    setScore(0);
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

  // Keyboard listener for desktop
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping, gameOver]);

  // --- NEW: Screen tap handler for mobile ---
  const handleScreenTap = (e) => {
    // Prevent jumping if the user is clicking the "Try Again" or "Close" buttons
    if (e.target.tagName.toLowerCase() !== 'button') {
      jump();
    }
  };

  return (
    <div 
      className="game-container" 
      style={{ backgroundImage: `url(${bgImage})` }}
      onClick={handleScreenTap}       // Tap anywhere on screen
      onTouchStart={handleScreenTap}  // Touch anywhere on phone
    >
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

        {/* We use a key based on gameOver state so the obstacle animation restarts properly on "Try Again" */}
        {!gameOver && (
          <img 
            ref={obstacleRef}
            src={obstacleImg} 
            alt="Obstacle" 
            className="obstacle" 
          />
        )}
      </div>

      {gameOver && (
        <div className="game-over-screen">
          <h1 className="game-over-title">Game Over!</h1>
          <p className="game-over-score">Score: {score}</p>
          
          <div className="game-over-buttons">
            <button className="btn pink-btn" onClick={resetGame}>Try Again</button>
            <button className="btn pink-btn outline-btn" onClick={onClose}>Close Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;