import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, TerminalSquare } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 200;

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreUpdate?: (score: number) => void;
}

export function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);
  
  useEffect(() => {
    snakeRef.current = snake;
    directionRef.current = direction;
    if (onScoreUpdate) onScoreUpdate(score);
  }, [snake, direction, score, onScoreUpdate]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "].includes(e.key)) {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }

    if (!isPlaying && !isGameOver && e.key === " ") {
      startGame();
      return;
    }
    if (isGameOver && e.key === " ") {
      startGame();
      return;
    }

    const { x, y } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (y === 0) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (y === 0) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (x === 0) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (x === 0) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setSnake((prevSnake) => {
      const currentHead = prevSnake[0];
      const newDirection = nextDirectionRef.current;
      setDirection(newDirection);

      const newHead = {
        x: currentHead.x + newDirection.x,
        y: currentHead.y + newDirection.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPlaying, isGameOver, food, score, highScore, generateFood]);

  useEffect(() => {
    const speed = Math.max(80, BASE_SPEED - (score / 10) * 2);
    const intervalId = setInterval(gameLoop, speed);
    return () => clearInterval(intervalId);
  }, [gameLoop, score]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="flex justify-between items-center w-full mb-4 px-4 py-2 border-4 border-[#ff00ff] bg-black shadow-[8px_8px_0px_0px_#00ffff]">
        <div className="flex flex-col">
          <span className="text-lg text-[#00ffff] animate-pulse">&gt; MEM_ALLOC</span>
          <span className="text-4xl font-bold text-[#ff00ff] glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg text-[#00ffff] animate-pulse">&gt; PEAK_MEM</span>
          <span className="text-4xl font-bold text-[#ff00ff]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-square border-4 border-[#00ffff] shadow-[8px_8px_0px_0px_#ff00ff] bg-[#111] p-1 animate-glitch" style={{ animationDuration: '5s' }}>
        <div 
          className="w-full h-full bg-black relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`z-10 ${isHead ? 'bg-[#00ffff]' : 'bg-[#00ffff]/60'} border border-black`}
                style={{
                  gridColumn: segment.x + 1,
                  gridRow: segment.y + 1,
                }}
              ></div>
            );
          })}

          <div
            className="z-10 bg-[#ff00ff] border border-black animate-pulse"
            style={{
              gridColumn: food.x + 1,
              gridRow: food.y + 1,
            }}
          ></div>
        </div>

        {(!isPlaying && !isGameOver && score === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
            <h2 className="text-5xl font-bold text-[#00ffff] mb-6 glitch-text" data-text="EXECUTE">
              EXECUTE
            </h2>
            <button 
              onClick={startGame}
              className="group flex flex-col items-center px-8 py-4 bg-[#ff00ff] text-black text-2xl font-bold hover:bg-[#00ffff] transition-colors border-4 border-transparent hover:border-white"
            >
              <TerminalSquare className="w-8 h-8 mb-2" />
              PRESS SPACE
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#ff00ff]/90 z-30 animate-tear">
            <h2 className="text-6xl font-bold text-black mb-2 glitch-text" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <p className="text-black text-2xl mb-8 font-bold bg-[#00ffff] px-4 py-1">SIGSEGV AT {score}</p>
            <button 
              onClick={startGame}
              className="flex items-center gap-4 px-8 py-4 bg-black text-[#00ffff] text-2xl font-bold border-4 border-black hover:border-[#00ffff] transition-all hover:text-[#ff00ff]"
            >
              <RefreshCw className="w-8 h-8" />
              REBOOT
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-8 text-xl text-[#00ffff] bg-black px-4 py-2 border-2 border-[#ff00ff] animate-pulse">
        <span>[W][A][S][D] // INPUT</span>
      </div>
    </div>
  );
}
