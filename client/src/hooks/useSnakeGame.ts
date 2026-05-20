import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Particle Interface for explosion effects
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

/**
 * Game State Interface
 */
export interface GameState {
  snake: [number, number][];
  food: [number, number];
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  nextDirection: "UP" | "DOWN" | "LEFT" | "RIGHT";
  score: number;
  gameOver: boolean;
  isPaused: boolean;
  gridSize: number;
  cellSize: number;
}

const GRID_SIZE = 30;
const MOVE_INTERVAL = 150; // ms per step

/**
 * Custom Hook: useSnakeGame
 * Manages all game logic including state, collision detection, and particle system
 */
export function useSnakeGame() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    snake: [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    food: [15, 15],
    direction: "UP",
    nextDirection: "UP",
    score: 0,
    gameOver: false,
    isPaused: false,
    gridSize: GRID_SIZE,
    cellSize: 0,
  });

  // Particle system (stored in ref to avoid re-renders)
  const particlesRef = useRef<Particle[]>([]);

  // Game loop interval
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Generate random food position that doesn't overlap with snake
   */
  const generateFood = useCallback(
    (snake: [number, number][]): [number, number] => {
      let newFood: [number, number] = [0, 0];
      let isOnSnake = true;

      while (isOnSnake) {
        newFood = [
          Math.floor(Math.random() * GRID_SIZE),
          Math.floor(Math.random() * GRID_SIZE),
        ];
        isOnSnake = snake.some(
          (segment) => segment[0] === newFood[0] && segment[1] === newFood[1]
        );
      }

      return newFood;
    },
    []
  );

  /**
   * Create particles for food consumption effect
   */
  const createParticles = useCallback(
    (x: number, y: number, color: string, count: number = 8) => {
      const particles: Particle[] = [];
      const angleStep = (Math.PI * 2) / count;

      for (let i = 0; i < count; i++) {
        const angle = angleStep * i;
        const speed = 0.3 + Math.random() * 0.3;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
        });
      }

      particlesRef.current.push(...particles);
    },
    []
  );

  /**
   * Update particles (gravity, decay, removal)
   */
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Apply gravity
      p.vy += 0.1;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Decay life
      p.life -= 0.05;

      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }, []);

  /**
   * Check if snake collides with itself
   */
  const checkSelfCollision = useCallback((snake: [number, number][]): boolean => {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (snake[i][0] === head[0] && snake[i][1] === head[1]) {
        return true;
      }
    }
    return false;
  }, []);

  /**
   * Move snake in current direction with wrap-around (no wall collision)
   */
  const moveSnake = useCallback(
    (
      snake: [number, number][],
      direction: "UP" | "DOWN" | "LEFT" | "RIGHT",
      food: [number, number]
    ): {
      newSnake: [number, number][];
      foodEaten: boolean;
      newFood: [number, number];
    } => {
      const head = snake[0];
      let newHead: [number, number];

      switch (direction) {
        case "UP":
          newHead = [head[0], (head[1] - 1 + GRID_SIZE) % GRID_SIZE];
          break;
        case "DOWN":
          newHead = [head[0], (head[1] + 1) % GRID_SIZE];
          break;
        case "LEFT":
          newHead = [(head[0] - 1 + GRID_SIZE) % GRID_SIZE, head[1]];
          break;
        case "RIGHT":
          newHead = [(head[0] + 1) % GRID_SIZE, head[1]];
          break;
      }

      const newSnake = [newHead, ...snake];
      const foodEaten = newHead[0] === food[0] && newHead[1] === food[1];

      if (!foodEaten) {
        newSnake.pop();
      }

      const newFood = foodEaten ? generateFood(newSnake) : food;

      return { newSnake, foodEaten, newFood };
    },
    [generateFood]
  );

  /**
   * Prevent reverse direction (can't go directly opposite)
   */
  const isValidDirection = useCallback(
    (
      currentDir: "UP" | "DOWN" | "LEFT" | "RIGHT",
      nextDir: "UP" | "DOWN" | "LEFT" | "RIGHT"
    ): boolean => {
      const opposites: Record<string, string> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };
      return opposites[currentDir] !== nextDir;
    },
    []
  );

  /**
   * Set next direction (queued for next move)
   */
  const setDirection = useCallback(
    (newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      setGameState((prev) => {
        if (isValidDirection(prev.direction, newDirection)) {
          return { ...prev, nextDirection: newDirection };
        }
        return prev;
      });
    },
    [isValidDirection]
  );

  /**
   * Toggle pause state
   */
  const togglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    const initialFood = generateFood([
      [1, 0],
      [1, 1],
      [1, 2],
    ]);

    setGameState({
      snake: [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      food: initialFood,
      direction: "UP",
      nextDirection: "UP",
      score: 0,
      gameOver: false,
      isPaused: false,
      gridSize: GRID_SIZE,
      cellSize: 0,
    });

    particlesRef.current = [];
  }, [generateFood]);

  /**
   * Main game loop
   */
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setGameState((prev) => {
        // Determine actual direction (use nextDirection if valid)
        const actualDirection = isValidDirection(prev.direction, prev.nextDirection)
          ? prev.nextDirection
          : prev.direction;

        // Move snake
        const { newSnake, foodEaten, newFood } = moveSnake(
          prev.snake,
          actualDirection,
          prev.food
        );

        // Create particles if food eaten
        if (foodEaten) {
          createParticles(newFood[0], newFood[1], "var(--neon-pink)", 10);
        }

        // Check self collision
        const collision = checkSelfCollision(newSnake);

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          direction: actualDirection,
          nextDirection: actualDirection,
          score: prev.score + (foodEaten ? 10 : 0),
          gameOver: collision,
        };
      });

      // Update particles
      updateParticles();
    }, MOVE_INTERVAL);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameOver, gameState.isPaused, moveSnake, checkSelfCollision, isValidDirection, createParticles, updateParticles]);

  /**
   * Update cellSize based on canvas dimensions
   */
  const updateCellSize = useCallback((width: number) => {
    const newCellSize = Math.floor(width / GRID_SIZE);
    setGameState((prev) => {
      if (prev.cellSize !== newCellSize) {
        return { ...prev, cellSize: newCellSize };
      }
      return prev;
    });
  }, []);

  return {
    gameState,
    setDirection,
    togglePause,
    resetGame,
    updateCellSize,
    particles: particlesRef.current,
  };
}
