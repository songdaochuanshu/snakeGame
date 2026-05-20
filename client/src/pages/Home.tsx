import { useEffect, useRef, useState } from "react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { useTouchControls } from "@/hooks/useTouchControls";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/**
 * Home Page - Cyberpunk Snake Game
 * 
 * Design Philosophy: Cyberpunk Grid Aesthetic
 * - Neon colors with glowing effects
 * - Scanlines overlay animation
 * - Responsive multi-device support
 * - Particle effects for food consumption
 */

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { gameState, setDirection, togglePause, resetGame, updateCellSize, particles } =
    useSnakeGame();

  useTouchControls(setDirection, containerRef as React.RefObject<HTMLDivElement>);

  const [isMobile, setIsMobile] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          setDirection("RIGHT");
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setDirection, togglePause]);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Scale context for device pixel ratio
    ctx.scale(dpr, dpr);

    // Update cell size
    updateCellSize(rect.width);

    const cellSize = gameState.cellSize;

    // Clear canvas with dark background
    ctx.fillStyle = "oklch(0.12 0.10 280)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid background
    ctx.strokeStyle = "oklch(0.50 0.20 180 / 0.1)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gameState.gridSize; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, gameState.gridSize * cellSize);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(gameState.gridSize * cellSize, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const x = segment[0] * cellSize;
      const y = segment[1] * cellSize;

      if (index === 0) {
        // Snake head - bright green with glow
        ctx.fillStyle = "oklch(0.70 0.35 130)";
        ctx.shadowColor = "oklch(0.70 0.35 130)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.shadowBlur = 0;
      } else {
        // Snake body - slightly darker green
        ctx.fillStyle = "oklch(0.65 0.32 130)";
        ctx.shadowColor = "oklch(0.70 0.35 130)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        ctx.shadowBlur = 0;
      }
    });

    // Draw food with pulsing effect
    const foodX = gameState.food[0] * cellSize;
    const foodY = gameState.food[1] * cellSize;
    const pulseRadius = 4 + Math.sin(Date.now() / 200) * 2;

    ctx.fillStyle = "oklch(0.65 0.32 330)";
    ctx.shadowColor = "oklch(0.65 0.32 330)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(
      foodX + cellSize / 2,
      foodY + cellSize / 2,
      pulseRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw particles
    particles.forEach((particle) => {
      const px = particle.x * cellSize + cellSize / 2;
      const py = particle.y * cellSize + cellSize / 2;

      ctx.globalAlpha = particle.life;
      ctx.fillStyle = "oklch(0.65 0.32 330)";
      ctx.shadowColor = "oklch(0.65 0.32 330)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.beginPath();
      ctx.arc(px, py, 2 * particle.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });
  }, [gameState, particles, updateCellSize]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-dark-purple text-neon-cyan flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Scanlines overlay */}
      <div className="scanlines" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-6xl font-bold neon-glow mb-2">
            SNAKE
          </h1>
          <p className="font-space-mono text-sm md:text-base text-neon-cyan">
            CYBERPUNK EDITION
          </p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="score-display">
            SCORE: {gameState.score}
          </div>
          <div className="font-space-mono text-sm text-neon-cyan mt-2">
            {gameState.gameOver
              ? "GAME OVER"
              : gameState.isPaused
                ? "PAUSED"
                : "PLAYING"}
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl">
            <canvas
              ref={canvasRef}
              className="game-canvas w-full aspect-square"
              style={{
                imageRendering: "pixelated",
                display: "block",
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Control Buttons - Desktop */}
        {!isMobile && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={togglePause}
              className="control-btn px-6 py-2 flex items-center gap-2"
            >
              {gameState.isPaused ? (
                <>
                  <Play size={20} /> RESUME
                </>
              ) : (
                <>
                  <Pause size={20} /> PAUSE
                </>
              )}
            </button>
            <button onClick={resetGame} className="control-btn px-6 py-2">
              RESET
            </button>
          </div>
        )}

        {/* D-Pad Controls - Mobile */}
        {isMobile && (
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-2 w-fit">
              {/* Empty top-left */}
              <div />

              {/* Up button */}
              <button
                onClick={() => setDirection("UP")}
                className="dpad-btn"
                aria-label="Up"
              >
                <ChevronUp size={24} />
              </button>

              {/* Empty top-right */}
              <div />

              {/* Left button */}
              <button
                onClick={() => setDirection("LEFT")}
                className="dpad-btn"
                aria-label="Left"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Pause/Play button - center */}
              <button
                onClick={togglePause}
                className="dpad-btn"
                aria-label="Pause/Play"
              >
                {gameState.isPaused ? (
                  <Play size={20} />
                ) : (
                  <Pause size={20} />
                )}
              </button>

              {/* Right button */}
              <button
                onClick={() => setDirection("RIGHT")}
                className="dpad-btn"
                aria-label="Right"
              >
                <ChevronRight size={24} />
              </button>

              {/* Empty bottom-left */}
              <div />

              {/* Down button */}
              <button
                onClick={() => setDirection("DOWN")}
                className="dpad-btn"
                aria-label="Down"
              >
                <ChevronDown size={24} />
              </button>

              {/* Empty bottom-right */}
              <div />
            </div>
          </div>
        )}

        {/* Keyboard instructions - Desktop */}
        {!isMobile && (
          <div className="text-center mb-4">
            <p className="font-space-mono text-xs md:text-sm text-neon-cyan opacity-75">
              Use ARROW KEYS or WASD to move • SPACE to pause
            </p>
          </div>
        )}

        {/* Touch instructions - Mobile */}
        {isMobile && (
          <div className="text-center mb-4">
            <p className="font-space-mono text-xs text-neon-cyan opacity-75">
              Swipe to move • Tap center to pause
            </p>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameState.gameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2 className="game-over-title">GAME OVER</h2>
            <p className="game-over-score">FINAL SCORE: {gameState.score}</p>
            <button onClick={resetGame} className="play-again-btn">
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
