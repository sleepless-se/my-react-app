import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const CELL_SIZE = 10;
const GRID_COLOR = '#CCCCCC';
const ALIVE_COLOR = '#000000';
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

const LifeGame = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState([]);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    // Initialize grid
    const newGrid = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => Math.random() > 0.7)
    );
    setGrid(newGrid);

    // Draw initial state
    drawGrid(ctx, width, height);
    drawCells(ctx, newGrid);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      if (isRunning) {
        setGrid(prevGrid => {
          const newGrid = prevGrid.map((row, i) =>
            row.map((cell, j) => {
              const neighbors = countNeighbors(prevGrid, i, j);
              if (cell) {
                return neighbors === 2 || neighbors === 3;
              } else {
                return neighbors === 3;
              }
            })
          );
          setGeneration(prev => prev + 1);
          return newGrid;
        });
        animationFrameId = requestAnimationFrame(update);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawGrid(ctx, canvas.width, canvas.height);
    drawCells(ctx, grid);
  }, [grid]);

  const countNeighbors = (grid, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const row = (x + i + grid.length) % grid.length;
        const col = (y + j + grid[0].length) % grid[0].length;
        sum += grid[row][col] ? 1 : 0;
      }
    }
    sum -= grid[x][y] ? 1 : 0;
    return sum;
  };

  const drawGrid = (ctx, width, height) => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for (let i = 0; i <= width; i += CELL_SIZE) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }

    for (let j = 0; j <= height; j += CELL_SIZE) {
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
    }

    ctx.stroke();
  };

  const drawCells = (ctx, grid) => {
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) {
          ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
          ctx.fillRect(
            j * CELL_SIZE,
            i * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        } else {
          ctx.clearRect(
            j * CELL_SIZE,
            i * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        }
      });
    });
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    const newGrid = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => Math.random() > 0.7)
    );
    setGrid(newGrid);
    setGeneration(0);
    drawGrid(ctx, width, height);
    drawCells(ctx, newGrid);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Colorful Life Game</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="text-lg font-semibold">Generation: {generation}</div>
          <div className="space-x-2">
            <button
              onClick={handleToggleRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center"
            >
              <RefreshCw className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeGame;
