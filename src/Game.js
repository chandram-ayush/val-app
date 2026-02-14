import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Game.css';
import playerImg from './runner1.png';
import chaserImg from './chaser1.png';
import obstacleImg from './obsimg.png';

const Game = ({ onClose, bgImage }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const playerRef = useRef(null);
  const obstacleRef = useRef(null);
  const scoreInterval = useRef(null);

  // Jump Logic
  const jump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 800); // Duration matches CSS animation
    }
  }, [isJumping, gameOver]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
  };

  // --- FIXED COLLISION DETECTION ---
  useEffect(() => {
    const detectCollision = setInterval(() => {
      if (gameOver) return;

      const player = playerRef.current;
      const obstacle = obstacleRef.current;

      if (player && obstacle) {
        // We use getBoundingClientRect() to get exact screen positions
        // This works perfectly even with % based CSS positions
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Check if rectangles overlap
        if (
          obstacleRect.left < playerRect.right - 20 && // Obstacle hits right side of player (with buffer)
          obstacleRect.right > playerRect.left + 20 && // Obstacle hits left side of player
          playerRect.bottom > obstacleRect.top + 20    // Player is not high enough (vertical collision)
        ) {
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Mobile Tap Control
  const handleScreenTap = (e) => {
    if (e.target.tagName.toLowerCase() !== 'button') {
      jump();
    }
  };

  return (
    <div 
      className="game-container" 
      style={{ backgroundImage: `url(${bgImage})` }}
      onClick={handleScreenTap}       
      onTouchStart={handleScreenTap}  
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

        {/* Conditionally render obstacle so it resets position on Game Over */}
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