"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Trophy,
  Undo2,
  Keyboard,
  Clock,
  Bot,
  Users,
  Brain,
  Volume2,
  VolumeX,
  Timer,
  TrendingUp,
  Zap,
  Flame,
  BarChart3,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const audioCtx =
  typeof window !== "undefined"
    ? new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)()
    : null;

function playTone(
  frequency: number,
  duration: number,
  volume: number = 0.08,
  type: OscillatorType = "sine"
) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration
  );
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

function playMoveSound() {
  playTone(800, 0.08, 0.06);
}

function playPlaceSound() {
  playTone(600, 0.12, 0.08);
}

function playWinSound() {
  playTone(523, 0.15, 0.07);
  setTimeout(() => playTone(659, 0.15, 0.07), 100);
  setTimeout(() => playTone(784, 0.25, 0.07), 200);
}

function playDrawSound() {
  playTone(400, 0.2, 0.06);
  setTimeout(() => playTone(350, 0.3, 0.06), 150);
}

function playUndoSound() {
  playTone(500, 0.06, 0.04);
}

type CellValue = "X" | "O" | null;
type Board = CellValue[];
type GameStatus = "playing" | "won" | "draw";
type GameMode = "2p" | "ai";
type Difficulty = "easy" | "medium" | "hard";

interface ConfettiParticle {
  id: number;
  originX: number;
  originY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const CELL_PERCENT_POSITIONS: [number, number][] = [
  [16.67, 16.67],
  [50, 16.67],
  [83.33, 16.67],
  [16.67, 50],
  [50, 50],
  [83.33, 50],
  [16.67, 83.33],
  [50, 83.33],
  [83.33, 83.33],
];

const CONFETTI_COLORS = [
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#14b8a6",
];

function createConfettiParticles(winCells: number[]): ConfettiParticle[] {
  const particles: ConfettiParticle[] = [];
  let id = 0;
  for (const cellIndex of winCells) {
    const [cx, cy] = CELL_PERCENT_POSITIONS[cellIndex];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 140;
      particles.push({
        id: id++,
        originX: cx,
        originY: cy,
        endX: cx + Math.cos(angle) * distance,
        endY: cy + Math.sin(angle) * distance - 40,
        color:
          CONFETTI_COLORS[
            Math.floor(Math.random() * CONFETTI_COLORS.length)
          ],
        size: 3 + Math.random() * 6,
        rotation: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.3,
      });
    }
  }
  return particles;
}

function checkWinner(board: Board): { winner: CellValue; line: number[] } | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function getGameStatus(board: Board): GameStatus {
  const result = checkWinner(board);
  if (result) return "won";
  if (board.every((cell) => cell !== null)) return "draw";
  return "playing";
}

function getStatusText(
  status: GameStatus,
  currentPlayer: CellValue,
  gameMode: GameMode
): string {
  if (status === "draw") return "Draw";
  if (status === "won") {
    if (gameMode === "ai") {
      return currentPlayer === "X" ? "AI Wins" : "You Win!";
    }
    return `Player ${currentPlayer === "X" ? "O" : "X"} Wins`;
  }
  if (gameMode === "ai") {
    return currentPlayer === "X" ? "Your Turn" : "AI Thinking…";
  }
  return `Player ${currentPlayer}'s Turn`;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner) return winner.winner === "O" ? 10 : -10;
  if (board.every((cell) => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function getRandomMove(board: Board): number {
  const available = board.reduce<number[]>((acc, cell, i) => {
    if (!cell) acc.push(i);
    return acc;
  }, []);
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

function getAIMove(board: Board, difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return getRandomMove(board);

    case "medium":
      if (Math.random() < 0.5) return getBestMove(board);
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "O";
          if (checkWinner(board)?.winner === "O") {
            board[i] = null;
            return i;
          }
          board[i] = null;
        }
      }
      const emptyCells = board.filter((c) => c === null).length;
      if (emptyCells <= 4) {
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            board[i] = "X";
            if (checkWinner(board)?.winner === "X") {
              board[i] = null;
              return i;
            }
            board[i] = null;
          }
        }
      }
      return getRandomMove(board);

    case "hard":
      return getBestMove(board);

    default:
      return getBestMove(board);
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [moveHistory, setMoveHistory] = useState<
    { player: CellValue; index: number }[]
  >([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [selectedCell, setSelectedCell] = useState<number | null>(4);
  const [gameMode, setGameMode] = useState<GameMode>("2p");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [aiThinking, setAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalMoves, setTotalMoves] = useState(0);
  const [fastestWin, setFastestWin] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confettiParticles, setConfettiParticles] = useState<
    ConfettiParticle[]
  >([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = getGameStatus(board);

  const resumeAudio = useCallback(() => {
    if (audioCtx?.state === "suspended") {
      audioCtx.resume();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!gameStartTime) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStartTime]);

  useEffect(() => {
    if (status === "won" && winLine.length > 0) {
      setConfettiParticles(createConfettiParticles(winLine));
    } else {
      setConfettiParticles([]);
    }
  }, [status, winLine]);

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    window.dispatchEvent(new CustomEvent("theme-changed"));
  }, []);

  const applyMove = useCallback(
    (
      boardState: Board,
      historyState: { player: CellValue; index: number }[],
      player: CellValue,
      index: number
    ) => {
      const newBoard = [...boardState];
      newBoard[index] = player;
      const newHistory = [...historyState, { player, index }];
      const result = checkWinner(newBoard);
      const gameOver = !!result || newBoard.every((cell) => cell !== null);
      return {
        newBoard,
        newHistory,
        gameOver,
        winResult: result,
        isDraw: !result && newBoard.every((cell) => cell !== null),
      };
    },
    []
  );

  const finishGame = useCallback(
    (
      winResult: { winner: CellValue; line: number[] } | null,
      isDraw: boolean,
      currentWinner?: CellValue,
      moveCount?: number
    ) => {
      if (moveCount !== undefined) {
        setTotalMoves((prev) => prev + moveCount);
      }
      if (winResult) {
        if (soundEnabled) playWinSound();
        setWinLine(winResult.line);
        setScore((prev) => ({
          ...prev,
          [winResult.winner!]: prev[winResult.winner as "X" | "O"] + 1,
        }));
        setGamesPlayed((prev) => prev + 1);
        setWinStreak((prev) => (currentWinner === "X" ? prev + 1 : 0));
        if (moveCount !== undefined) {
          setFastestWin((prev) => {
            if (prev === null || moveCount < prev) return moveCount;
            return prev;
          });
        }
      } else if (isDraw) {
        if (soundEnabled) playDrawSound();
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
        setGamesPlayed((prev) => prev + 1);
        setWinStreak(0);
      }
    },
    [soundEnabled]
  );

  const triggerAIMove = useCallback(
    (
      currentBoard: Board,
      currentHistory: { player: CellValue; index: number }[]
    ) => {
      setAiThinking(true);
      aiTimeoutRef.current = setTimeout(() => {
        setBoard((prevBoard) => {
          const move = getAIMove([...prevBoard], difficulty);
          if (move === -1) return prevBoard;

          const { newBoard, newHistory, winResult, isDraw } = applyMove(
            prevBoard,
            currentHistory,
            "O",
            move
          );

          setTimeout(() => {
            setMoveHistory(newHistory);
            if (soundEnabled) playMoveSound();
            if (winResult || isDraw) {
              finishGame(winResult, isDraw, "O", newHistory.length);
            }
          }, 0);

          return newBoard;
        });
        setCurrentPlayer("X");
        setAiThinking(false);
      }, 400);
    },
    [difficulty, applyMove, finishGame, soundEnabled]
  );

  const handleCellClick = useCallback(
    (index: number) => {
      resumeAudio();
      if (board[index] || status !== "playing") return;
      if (gameMode === "ai" && (currentPlayer !== "X" || aiThinking)) return;

      const isFirstMove = moveHistory.length === 0;
      if (isFirstMove) {
        setGameStartTime(Date.now());
      }

      const { newBoard, newHistory, winResult, isDraw } = applyMove(
        board,
        moveHistory,
        currentPlayer,
        index
      );

      setBoard(newBoard);
      setMoveHistory(newHistory);

      if (soundEnabled) playPlaceSound();

      if (winResult || isDraw) {
        finishGame(winResult, isDraw, currentPlayer, newHistory.length);
      } else {
        const nextPlayer = currentPlayer === "X" ? "O" : "X";
        setCurrentPlayer(nextPlayer);
        if (gameMode === "ai" && nextPlayer === "O") {
          triggerAIMove(newBoard, newHistory);
        }
      }
    },
    [
      board,
      status,
      gameMode,
      currentPlayer,
      aiThinking,
      moveHistory,
      applyMove,
      finishGame,
      triggerAIMove,
      soundEnabled,
      resumeAudio,
    ]
  );

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || status !== "playing") return;
    if (soundEnabled) playUndoSound();

    if (gameMode === "ai") {
      if (aiThinking) return;
      if (moveHistory.length < 2) return;

      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
        setAiThinking(false);
      }

      const newBoard = [...board];
      for (let i = 0; i < 2; i++) {
        const move = moveHistory[moveHistory.length - 1 - i];
        newBoard[move.index] = null;
      }

      setBoard(newBoard);
      setMoveHistory(moveHistory.slice(0, -2));
      setCurrentPlayer("X");
      setWinLine([]);
      setSelectedCell(moveHistory[moveHistory.length - 2]?.index ?? null);

      if (moveHistory.length <= 2) {
        setGameStartTime(null);
        setElapsedSeconds(0);
      }
    } else {
      const newHistory = [...moveHistory];
      const lastMove = newHistory.pop()!;
      const newBoard = [...board];
      newBoard[lastMove.index] = null;

      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentPlayer(lastMove.player);
      setWinLine([]);
      setSelectedCell(lastMove.index);

      if (newHistory.length === 0) {
        setGameStartTime(null);
        setElapsedSeconds(0);
      }
    }
  }, [board, moveHistory, status, gameMode, aiThinking, soundEnabled]);

  const handleReset = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setAiThinking(false);
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinLine([]);
    setMoveHistory([]);
    setSelectedCell(4);
    setGameStartTime(null);
    setElapsedSeconds(0);
    setConfettiParticles([]);
  }, []);

  const handleFullReset = useCallback(() => {
    handleReset();
    setScore({ X: 0, O: 0, draw: 0 });
    setGamesPlayed(0);
    setWinStreak(0);
    setTotalMoves(0);
    setFastestWin(null);
  }, [handleReset]);

  useEffect(() => {
    if (status !== "playing") {
      const timer = setTimeout(() => {
        handleReset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, handleReset]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleReset();
        return;
      }

      if (e.key.toLowerCase() === "t" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleTheme();
        return;
      }

      if (status !== "playing") return;
      if (gameMode === "ai" && (currentPlayer !== "X" || aiThinking)) return;

      const keyMap: Record<string, [number, number]> = {
        "1": [0, 0],
        "2": [0, 1],
        "3": [0, 2],
        "4": [1, 0],
        "5": [1, 1],
        "6": [1, 2],
        "7": [2, 0],
        "8": [2, 1],
        "9": [2, 2],
      };

      if (e.key === "ArrowUp" && selectedCell !== null) {
        e.preventDefault();
        const newRow = Math.max(0, Math.floor(selectedCell / 3) - 1);
        setSelectedCell(newRow * 3 + (selectedCell % 3));
      } else if (e.key === "ArrowDown" && selectedCell !== null) {
        e.preventDefault();
        const newRow = Math.min(2, Math.floor(selectedCell / 3) + 1);
        setSelectedCell(newRow * 3 + (selectedCell % 3));
      } else if (e.key === "ArrowLeft" && selectedCell !== null) {
        e.preventDefault();
        const newCol = Math.max(0, (selectedCell % 3) - 1);
        setSelectedCell(Math.floor(selectedCell / 3) * 3 + newCol);
      } else if (e.key === "ArrowRight" && selectedCell !== null) {
        e.preventDefault();
        const newCol = Math.min(2, (selectedCell % 3) + 1);
        setSelectedCell(Math.floor(selectedCell / 3) * 3 + newCol);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (selectedCell !== null) handleCellClick(selectedCell);
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
      } else if (keyMap[e.key]) {
        const [row, col] = keyMap[e.key];
        const idx = row * 3 + col;
        setSelectedCell(idx);
        handleCellClick(idx);
      }
    },
    [
      status,
      gameMode,
      currentPlayer,
      aiThinking,
      selectedCell,
      handleCellClick,
      handleUndo,
      handleReset,
      toggleTheme,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const statusText = getStatusText(status, currentPlayer, gameMode);
  const undoDisabled =
    moveHistory.length === 0 ||
    status !== "playing" ||
    (gameMode === "ai" && (aiThinking || moveHistory.length < 2));
  const lastMoveIndex =
    moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].index : -1;
  const winRate =
    gamesPlayed > 0 ? ((score.X / gamesPlayed) * 100).toFixed(1) : "0.0";

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-16">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex w-full max-w-lg flex-col items-center gap-6"
      >
        <div className="text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight glow-text">
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Classic strategy game
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/30 bg-secondary/10 p-1">
            <Button
              variant={gameMode === "2p" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                if (gameMode !== "2p") {
                  handleReset();
                  setGameMode("2p");
                }
              }}
              className={`h-8 gap-1.5 px-3 text-xs font-medium ${
                gameMode === "2p"
                  ? "bg-card/80 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-3.5" />
              2 Players
            </Button>
            <Button
              variant={gameMode === "ai" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                if (gameMode !== "ai") {
                  handleReset();
                  setGameMode("ai");
                }
              }}
              className={`h-8 gap-1.5 px-3 text-xs font-medium ${
                gameMode === "ai"
                  ? "bg-card/80 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="size-3.5" />
              vs AI
            </Button>
          </div>

          <AnimatePresence>
            {gameMode === "ai" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-1 rounded-lg border border-border/30 bg-secondary/10 p-1">
                  <Brain className="ml-1.5 size-3 text-muted-foreground/60" />
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setDifficulty(d);
                        handleReset();
                      }}
                      className={`h-7 px-2.5 text-[11px] font-medium capitalize ${
                        difficulty === d
                          ? "bg-card/80 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex w-full items-center gap-3">
          <Card className="flex-1 border-border/40 bg-card/40">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5 text-sm">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {gameMode === "ai" ? "You (X)" : "Player X"}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {score.X}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Draw
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-muted-foreground">
                      {score.draw}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {gameMode === "ai" ? "AI (O)" : "Player O"}
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {score.O}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUndo}
                    disabled={undoDisabled}
                    className="size-8"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="size-8"
                    title="New Game (N)"
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullReset}
                    disabled={gamesPlayed === 0}
                    className="size-8"
                    title="Reset Score"
                  >
                    <Clock className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="size-8"
                    title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="size-3.5" />
                    ) : (
                      <VolumeX className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {winStreak > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
            <Flame className="size-3 text-amber-500/80" />
            <span>
              X Win Streak:{" "}
              <span className="text-amber-500/80 font-bold">{winStreak}</span>
            </span>
          </div>
        )}

        <div className="relative">
          {status === "playing" && (
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {aiThinking ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="relative flex size-2">
                    <motion.span
                      className="absolute inline-flex size-full rounded-full bg-muted-foreground"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.7, 0.2, 0.7],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative inline-flex size-2 rounded-full bg-muted-foreground/80" />
                  </span>
                  AI Thinking…
                </motion.span>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.span
                    className="relative inline-flex size-6 items-center justify-center rounded border border-border/50 text-xs font-bold"
                    style={{
                      color:
                        currentPlayer === "X"
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0px 0px rgba(var(--color-primary), 0)",
                        "0 0 12px 4px rgba(var(--color-primary), 0.3)",
                        "0 0 0px 0px rgba(var(--color-primary), 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {currentPlayer}
                  </motion.span>
                  <span className="text-sm">{statusText}</span>
                  {gameStartTime && (
                    <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground/50">
                      <Timer className="size-3" />
                      <span className="font-mono tabular-nums">
                        {formatTime(elapsedSeconds)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="relative inline-block">
            <div className="animated-gradient-border rounded-xl p-[2px]">
              <div
                ref={boardRef}
                className="grid grid-cols-3 gap-1.5 rounded-[10px] bg-background p-2.5 relative z-[1]"
              >
                {board.map((cell, index) => {
                  const isWinCell = winLine.includes(index);
                  const isSelected =
                    selectedCell === index && status === "playing" && !cell;
                  const isLastMove = lastMoveIndex === index && cell;
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleCellClick(index)}
                      onMouseEnter={() => setSelectedCell(index)}
                      disabled={
                        !!cell ||
                        status !== "playing" ||
                        (gameMode === "ai" &&
                          (currentPlayer !== "X" || aiThinking))
                      }
                      className={`relative flex size-24 items-center justify-center rounded-lg border text-2xl font-bold transition-all duration-200 sm:size-28 ${
                        isWinCell
                          ? "border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/5"
                          : cell
                            ? "border-border/20 bg-card/40"
                            : isSelected
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/30 bg-card/20 hover:border-border/60 hover:bg-card/40"
                      }`}
                    >
                      <span className="absolute top-1.5 right-2 font-mono text-[9px] text-muted-foreground/30">
                        {row * 3 + col + 1}
                      </span>
                      {isLastMove && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute bottom-1.5 left-1.5 size-1.5 rounded-full bg-primary/50"
                        />
                      )}
                      <AnimatePresence mode="wait">
                        {cell && (
                          <motion.span
                            key={cell + index}
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{
                              duration: 0.15,
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className={
                              cell === "X"
                                ? "text-foreground"
                                : "text-muted-foreground/80"
                            }
                          >
                            {cell}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {status !== "playing" && (
                <motion.div
                  key={status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm"
                >
                  {status === "won" && (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <Trophy className="size-14 text-amber-500 drop-shadow-lg" />
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-xl font-bold text-gradient"
                      >
                        {statusText}
                      </motion.h2>
                      {gameStartTime && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60"
                        >
                          <Timer className="size-3" />
                          <span className="font-mono">
                            {formatTime(elapsedSeconds)}
                          </span>
                        </motion.p>
                      )}
                      {confettiParticles.length > 0 && (
                        <div className="absolute inset-0 pointer-events-none overflow-visible rounded-xl">
                          {confettiParticles.map((p) => (
                            <motion.div
                              key={p.id}
                              className="absolute rounded-sm"
                              style={{
                                left: `${p.originX}%`,
                                top: `${p.originY}%`,
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                              }}
                              initial={{
                                opacity: 1,
                                scale: 0,
                                x: 0,
                                y: 0,
                                rotate: 0,
                              }}
                              animate={{
                                opacity: 0,
                                scale: [0, 1.2, 0.8, 0],
                                x: p.endX - p.originX,
                                y: p.endY - p.originY,
                                rotate: p.rotation,
                              }}
                              transition={{
                                duration: 1.5 + Math.random() * 0.5,
                                delay: p.delay,
                                ease: "easeOut",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {status === "draw" && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="text-4xl"
                      >
                        🤝
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-xl font-bold text-muted-foreground"
                      >
                        It&apos;s a Draw
                      </motion.h2>
                      {gameStartTime && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60"
                        >
                          <Timer className="size-3" />
                          <span className="font-mono">
                            {formatTime(elapsedSeconds)}
                          </span>
                        </motion.p>
                      )}
                    </>
                  )}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 font-mono text-[11px] text-muted-foreground/40"
                  >
                    New game starting…
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Keyboard className="size-3" />
            <span>Arrow keys + Enter</span>
          </div>
          <div className="flex items-center gap-2">
            {gameMode === "ai" && (
              <span className="rounded-md border border-border/20 bg-secondary/20 px-1.5 py-0.5 font-mono text-[10px] capitalize">
                {difficulty}
              </span>
            )}
            <span className="font-mono">Games: {gamesPlayed}</span>
          </div>
        </div>

        {moveHistory.length > 0 && (
          <Card className="w-full border-border/30 bg-card/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-3 text-muted-foreground/60" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                  Move History
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/30">
                  {moveHistory.length} moves
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {moveHistory.map((move, idx) => {
                  const row = Math.floor(move.index / 3) + 1;
                  const col = (move.index % 3) + 1;
                  const isAIMove =
                    gameMode === "ai" && move.player === "O";
                  return (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.15,
                        delay: idx === moveHistory.length - 1 ? 0 : undefined,
                      }}
                      className={`inline-flex items-center gap-0.5 rounded-md border border-border/20 bg-secondary/20 px-1.5 py-0.5 font-mono text-[10px] ${
                        move.player === "X"
                          ? "text-foreground/70"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      {isAIMove && (
                        <Bot className="size-2.5 text-muted-foreground/40" />
                      )}
                      <span className="font-bold">{move.player}</span>
                      <span className="text-muted-foreground/40">
                        ({row},{col})
                      </span>
                    </motion.span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="w-full border-border/30 bg-card/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="size-3 text-muted-foreground/60" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                Game Statistics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="size-3 text-emerald-500/70" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                    Win Rate (X)
                  </span>
                </div>
                <span className="text-lg font-bold tabular-nums text-gradient">
                  {winRate}%
                </span>
              </div>
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="size-3 text-sky-500/70" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                    Total Moves
                  </span>
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {totalMoves}
                </span>
              </div>
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="size-3 text-amber-500/70" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                    Fastest Win
                  </span>
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {fastestWin !== null ? `${fastestWin} moves` : "—"}
                </span>
              </div>
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="size-3 text-rose-500/70" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                    X Streak
                  </span>
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {winStreak > 0 ? `${winStreak} 🔥` : "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
