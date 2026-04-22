"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  Settings,
  Share2,
  Play,
  ChevronDown,
  Trash2,
  Undo2Icon,
  Target,
  Hash,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ────────────────────────────────────────
// Audio
// ────────────────────────────────────────

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
  type: OscillatorType = "sine",
  volumeMultiplier: number = 1
) {
  if (!audioCtx || volumeMultiplier === 0) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume * volumeMultiplier, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration
  );
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

function playPlaceSound(vol: number) {
  playTone(600, 0.12, 0.08, "sine", vol);
}

function playMoveSound(vol: number) {
  playTone(800, 0.08, 0.06, "sine", vol);
}

function playWinSound(vol: number) {
  playTone(523, 0.15, 0.07, "sine", vol);
  setTimeout(() => playTone(659, 0.15, 0.07, "sine", vol), 100);
  setTimeout(() => playTone(784, 0.25, 0.07, "sine", vol), 200);
}

function playDrawSound(vol: number) {
  playTone(400, 0.2, 0.06, "sine", vol);
  setTimeout(() => playTone(350, 0.3, 0.06, "sine", vol), 150);
}

function playUndoSound(vol: number) {
  playTone(500, 0.06, 0.04, "sine", vol);
}

// ────────────────────────────────────────
// Types
// ────────────────────────────────────────

type CellValue = "X" | "O" | null;
type Board = CellValue[];
type GameStatus = "playing" | "won" | "draw";
type GameMode = "2p" | "ai";
type Difficulty = "easy" | "medium" | "hard";
type BoardTheme = "minimal" | "neon" | "classic";

interface GameSettings {
  autoResetTimer: number;
  boardTheme: BoardTheme;
  showMoveNumbers: boolean;
  soundVolume: number;
}

interface MoveEntry {
  player: CellValue;
  index: number;
  timestamp: number;
}

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

interface GameHistoryEntry {
  id: number;
  mode: GameMode;
  result: string;
  moveCount: number;
  duration: number;
}

// ────────────────────────────────────────
// Constants
// ────────────────────────────────────────

const DEFAULT_SETTINGS: GameSettings = {
  autoResetTimer: 3,
  boardTheme: "minimal",
  showMoveNumbers: false,
  soundVolume: 80,
};

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

const POSITION_LABELS = [
  "Top-Left",
  "Top-Center",
  "Top-Right",
  "Mid-Left",
  "Center",
  "Mid-Right",
  "Bot-Left",
  "Bot-Center",
  "Bot-Right",
];

const SETTINGS_KEY = "ttt-settings";

// ────────────────────────────────────────
// Helpers
// ────────────────────────────────────────

function loadSettings(): GameSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      autoResetTimer:
        typeof parsed.autoResetTimer === "number"
          ? parsed.autoResetTimer
          : DEFAULT_SETTINGS.autoResetTimer,
      boardTheme:
        parsed.boardTheme === "minimal" ||
        parsed.boardTheme === "neon" ||
        parsed.boardTheme === "classic"
          ? parsed.boardTheme
          : DEFAULT_SETTINGS.boardTheme,
      showMoveNumbers:
        typeof parsed.showMoveNumbers === "boolean"
          ? parsed.showMoveNumbers
          : DEFAULT_SETTINGS.showMoveNumbers,
      soundVolume:
        typeof parsed.soundVolume === "number"
          ? parsed.soundVolume
          : DEFAULT_SETTINGS.soundVolume,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: GameSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

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
    return currentPlayer === "X" ? "Your Turn" : "AI Thinking\u2026";
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

// ────────────────────────────────────────
// Sparkline component
// ────────────────────────────────────────

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[2px] h-4">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-all duration-300"
          style={{
            height: `${Math.max(2, (v / max) * 16)}px`,
            backgroundColor: color,
            opacity: 0.4 + (i / values.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────
// Main Component
// ────────────────────────────────────────

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [moveHistory, setMoveHistory] = useState<MoveEntry[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [selectedCell, setSelectedCell] = useState<number | null>(4);
  const [gameMode, setGameMode] = useState<GameMode>("2p");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [aiThinking, setAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalMoves, setTotalMoves] = useState(0);
  const [fastestWin, setFastestWin] = useState<number | null>(null);
  const [longestGame, setLongestGame] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [confettiParticles, setConfettiParticles] = useState<
    ConfettiParticle[]
  >([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [gameCounter, setGameCounter] = useState(0);
  const [rippleCell, setRippleCell] = useState<number | null>(null);
  const [shakeCell, setShakeCell] = useState<number | null>(null);
  const [lastGameResult, setLastGameResult] = useState<{
    winner: CellValue;
    moves: number;
    time: number;
  } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsLoadedRef = useRef(false);

  const status = getGameStatus(board);
  const vol = settings.soundVolume / 100;

  // Load settings from localStorage on mount
  useEffect(() => {
    if (!settingsLoadedRef.current) {
      const loaded = loadSettings();
      setSettings(loaded);
      settingsLoadedRef.current = true;
    }
  }, []);

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

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const applyMove = useCallback(
    (
      boardState: Board,
      historyState: MoveEntry[],
      player: CellValue,
      index: number
    ) => {
      const newBoard = [...boardState];
      newBoard[index] = player;
      const newHistory: MoveEntry = {
        player,
        index,
        timestamp: Date.now(),
      };
      const combined = [...historyState, newHistory];
      const result = checkWinner(newBoard);
      const gameOver = !!result || newBoard.every((cell) => cell !== null);
      return {
        newBoard,
        newHistory: combined,
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
      const gameDuration = gameStartTime
        ? Math.floor((Date.now() - gameStartTime) / 1000)
        : 0;

      if (moveCount !== undefined) {
        setTotalMoves((prev) => prev + moveCount);
        if (moveCount > longestGame) {
          setLongestGame(moveCount);
        }
      }

      if (winResult) {
        if (soundEnabled) playWinSound(vol);
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
        setLastGameResult({
          winner: winResult.winner,
          moves: moveCount ?? moveHistory.length,
          time: gameDuration,
        });
        setGameCounter((prev) => prev + 1);
        setGameHistory((prev) => [
          {
            id: prev.length + 1,
            mode: gameMode,
            result:
              winResult.winner === "X"
                ? "X Won"
                : "O Won",
            moveCount: moveCount ?? moveHistory.length,
            duration: gameDuration,
          },
          ...prev,
        ].slice(0, 10));
      } else if (isDraw) {
        if (soundEnabled) playDrawSound(vol);
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
        setGamesPlayed((prev) => prev + 1);
        setWinStreak(0);
        setLastGameResult({
          winner: null,
          moves: moveCount ?? moveHistory.length,
          time: gameDuration,
        });
        setGameCounter((prev) => prev + 1);
        setGameHistory((prev) => [
          {
            id: prev.length + 1,
            mode: gameMode,
            result: "Draw",
            moveCount: moveCount ?? moveHistory.length,
            duration: gameDuration,
          },
          ...prev,
        ].slice(0, 10));
      }
    },
    [
      soundEnabled,
      vol,
      longestGame,
      gameStartTime,
      gameMode,
      moveHistory.length,
    ]
  );

  const triggerAIMove = useCallback(
    (currentBoard: Board, currentHistory: MoveEntry[]) => {
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
            if (soundEnabled) playMoveSound(vol);
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
    [difficulty, applyMove, finishGame, soundEnabled, vol]
  );

  const handleCellClick = useCallback(
    (index: number) => {
      resumeAudio();
      if (board[index] || status !== "playing") {
        if (status === "playing" && board[index]) {
          setShakeCell(index);
          setTimeout(() => setShakeCell(null), 400);
        }
        return;
      }
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
      setRippleCell(index);
      setTimeout(() => setRippleCell(null), 600);

      if (soundEnabled) playPlaceSound(vol);

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
      vol,
      resumeAudio,
    ]
  );

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || status !== "playing") return;
    if (soundEnabled) playUndoSound(vol);

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
  }, [board, moveHistory, status, gameMode, aiThinking, soundEnabled, vol]);

  const handleUndoAll = useCallback(() => {
    if (moveHistory.length === 0 || status !== "playing") return;
    if (gameMode === "ai" && aiThinking) return;
    if (soundEnabled) playUndoSound(vol);
    setBoard(Array(9).fill(null));
    setMoveHistory([]);
    setCurrentPlayer("X");
    setWinLine([]);
    setSelectedCell(4);
    setGameStartTime(null);
    setElapsedSeconds(0);
  }, [moveHistory.length, status, gameMode, aiThinking, soundEnabled, vol]);

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
    setLastGameResult(null);
  }, []);

  const handleFullReset = useCallback(() => {
    handleReset();
    setScore({ X: 0, O: 0, draw: 0 });
    setGamesPlayed(0);
    setWinStreak(0);
    setTotalMoves(0);
    setFastestWin(null);
    setLongestGame(0);
    setGameHistory([]);
    setGameCounter(0);
  }, [handleReset]);

  useEffect(() => {
    if (status !== "playing") {
      const timer = setTimeout(() => {
        handleReset();
      }, settings.autoResetTimer * 1000);
      return () => clearTimeout(timer);
    }
  }, [status, handleReset, settings.autoResetTimer]);

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

  // ────────────────────────────────────────
  // Derived values
  // ────────────────────────────────────────

  const statusText = getStatusText(status, currentPlayer, gameMode);
  const undoDisabled =
    moveHistory.length === 0 ||
    status !== "playing" ||
    (gameMode === "ai" && (aiThinking || moveHistory.length < 2));
  const undoAllDisabled =
    moveHistory.length === 0 ||
    status !== "playing" ||
    (gameMode === "ai" && aiThinking);
  const lastMoveIndex =
    moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].index : -1;
  const winRateX =
    gamesPlayed > 0 ? ((score.X / gamesPlayed) * 100).toFixed(1) : "0.0";
  const winRateO =
    gamesPlayed > 0 ? ((score.O / gamesPlayed) * 100).toFixed(1) : "0.0";
  const avgMoves =
    gamesPlayed > 0 ? (totalMoves / gamesPlayed).toFixed(1) : "0.0";

  // Move number map: for each cell index, which move number was it
  const moveNumberMap = useRef<Map<number, number>>(new Map());
  moveNumberMap.current = new Map();
  moveHistory.forEach((m, i) => {
    moveNumberMap.current.set(m.index, i + 1);
  });

  // Board theme class
  const boardThemeClass =
    settings.boardTheme === "neon"
      ? "board-neon"
      : settings.boardTheme === "classic"
        ? "board-classic"
        : "";

  // Win cell extra class per theme
  const winCellThemeClass = settings.boardTheme === "neon"
    ? "win-cell-neon"
    : settings.boardTheme === "classic"
      ? "win-cell-classic"
      : "";

  // Mark class per theme
  const getMarkClass = (cell: CellValue) => {
    if (settings.boardTheme === "neon") {
      return cell === "X" ? "mark-x" : "mark-o";
    }
    if (settings.boardTheme === "classic") {
      return cell === "X" ? "mark-x" : "mark-o";
    }
    return cell === "X" ? "text-foreground" : "text-muted-foreground/80";
  };

  // ────────────────────────────────────────
  // Get winner for overlay text
  // ────────────────────────────────────────

  const winnerForOverlay =
    status === "won"
      ? checkWinner(board)?.winner
      : null;

  const handleShareResult = useCallback(() => {
    const winner = winnerForOverlay;
    const text =
      winner === "X"
        ? `\u{1F3C6} X won at Tic-Tac-Toe! ${moveHistory.length} moves, ${formatTime(elapsedSeconds)}`
        : winner === "O"
          ? `\u{1F3C6} O won at Tic-Tac-Toe! ${moveHistory.length} moves, ${formatTime(elapsedSeconds)}`
          : `\u{1F91D} Draw at Tic-Tac-Toe! ${moveHistory.length} moves, ${formatTime(elapsedSeconds)}`;
    navigator.clipboard.writeText(text).catch(() => {
      /* silently fail */
    });
  }, [winnerForOverlay, moveHistory.length, elapsedSeconds]);

  // ────────────────────────────────────────
  // Render
  // ────────────────────────────────────────

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-16">
      <div className="ambient-grid absolute inset-0 pointer-events-none opacity-30" />

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gradient">
              <Settings className="size-4" />
              Game Settings
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/60">
              Configure your game experience
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-2">
            {/* Auto-reset Timer */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">
                  Auto-reset Timer
                </label>
                <span className="text-xs font-mono tabular-nums text-muted-foreground">
                  {settings.autoResetTimer}s
                </span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[settings.autoResetTimer]}
                onValueChange={([v]) => updateSettings({ autoResetTimer: v })}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/40 font-mono">
                <span>1s</span>
                <span>10s</span>
              </div>
            </div>

            {/* Board Theme */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">
                Board Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["minimal", "neon", "classic"] as BoardTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateSettings({ boardTheme: t })}
                    className={`rounded-lg border px-3 py-2 text-[11px] font-medium capitalize transition-all ${
                      settings.boardTheme === t
                        ? "border-primary/50 bg-primary/10 text-foreground shadow-sm"
                        : "border-border/30 bg-secondary/10 text-muted-foreground/60 hover:border-border/50 hover:bg-secondary/20"
                    }`}
                  >
                    {t === "neon" && (
                      <span className="mr-1 inline-block size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                    )}
                    {t === "classic" && (
                      <span className="mr-1 inline-block size-1.5 rounded-full bg-amber-500" />
                    )}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Show Move Numbers */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="size-3.5 text-muted-foreground/50" />
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">
                  Show Move Numbers
                </label>
              </div>
              <Switch
                checked={settings.showMoveNumbers}
                onCheckedChange={(v) => updateSettings({ showMoveNumbers: v })}
              />
            </div>

            {/* Sound Volume */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60">
                  Sound Volume
                </label>
                <span className="text-xs font-mono tabular-nums text-muted-foreground">
                  {settings.soundVolume}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[settings.soundVolume]}
                onValueChange={([v]) => updateSettings({ soundVolume: v })}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/40 font-mono">
                <span>Mute</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex w-full max-w-lg flex-col items-center gap-6"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight glow-text">
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Classic strategy game
          </p>
        </div>

        {/* Mode + Difficulty */}
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

        {/* Scoreboard */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                    className="size-8"
                    title="Settings"
                  >
                    <Settings className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Win Streak */}
        {winStreak > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
            <Flame className="size-3 text-amber-500/80" />
            <span>
              X Win Streak:{" "}
              <span className="text-amber-500/80 font-bold">{winStreak}</span>
            </span>
          </div>
        )}

        {/* Game Board Area */}
        <div className="relative">
          {/* Turn indicator */}
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
                  AI Thinking&#8230;
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

          {/* Board */}
          <div className="relative inline-block">
            <div className="animated-gradient-border rounded-xl p-[2px]">
              <div
                ref={boardRef}
                className={`grid grid-cols-3 gap-1.5 rounded-[10px] bg-background p-2.5 relative z-[1] ${boardThemeClass}`}
              >
                {board.map((cell, index) => {
                  const isWinCell = winLine.includes(index);
                  const isSelected =
                    selectedCell === index && status === "playing" && !cell;
                  const isLastMove = lastMoveIndex === index && cell;
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const isShaking = shakeCell === index;
                  const isRippling = rippleCell === index;
                  const moveNum = settings.showMoveNumbers
                    ? moveNumberMap.current.get(index)
                    : undefined;

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
                      className={`relative flex size-24 items-center justify-center rounded-lg border text-2xl font-bold transition-all duration-200 sm:size-28 overflow-hidden ${
                        isShaking ? "cell-shake" : ""
                      } ${
                        isWinCell
                          ? winCellThemeClass
                            ? winCellThemeClass
                            : "border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/5"
                          : cell
                            ? "border-border/20 bg-card/40"
                            : isSelected
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/30 bg-card/20 hover:border-border/60 hover:bg-card/40"
                      }`}
                    >
                      {/* Ripple */}
                      {isRippling && (
                        <div className="cell-ripple" />
                      )}

                      {/* Position number */}
                      <span className="absolute top-1.5 right-2 font-mono text-[9px] text-muted-foreground/30">
                        {row * 3 + col + 1}
                      </span>

                      {/* Move order number */}
                      {moveNum !== undefined && cell && (
                        <span className="absolute bottom-1 right-1.5 font-mono text-[8px] text-muted-foreground/25 select-none">
                          {moveNum}
                        </span>
                      )}

                      {/* Last move indicator */}
                      {isLastMove && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute bottom-1.5 left-1.5 size-1.5 rounded-full bg-primary/50"
                        />
                      )}

                      {/* Mark */}
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
                            className={getMarkClass(cell)}
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

            {/* Win/Draw Overlay */}
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
                        animate={{
                          scale: 1,
                          rotate: 0,
                        }}
                        transition={{
                          delay: 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 12,
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

                      {/* Stats summary */}
                      {lastGameResult && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-1 text-xs text-muted-foreground/60 font-mono"
                        >
                          Won in {lastGameResult.moves} moves &middot;{" "}
                          {formatTime(lastGameResult.time)}
                        </motion.p>
                      )}

                      {/* Timer */}
                      {gameStartTime && !lastGameResult && (
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

                      {/* Action buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 flex items-center gap-2"
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleReset}
                          className="h-7 gap-1.5 px-3 text-[11px] font-medium"
                        >
                          <Play className="size-3" />
                          Play Again
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleShareResult}
                          className="h-7 gap-1.5 px-3 text-[11px]"
                        >
                          <Share2 className="size-3" />
                          Share
                        </Button>
                      </motion.div>

                      {/* Confetti */}
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
                        {"\u{1F91D}"}
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-xl font-bold text-muted-foreground"
                      >
                        It&apos;s a Draw
                      </motion.h2>
                      {lastGameResult && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-1 text-xs text-muted-foreground/60 font-mono"
                        >
                          {lastGameResult.moves} moves &middot;{" "}
                          {formatTime(lastGameResult.time)}
                        </motion.p>
                      )}
                      {!lastGameResult && gameStartTime && (
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
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 flex items-center gap-2"
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleReset}
                          className="h-7 gap-1.5 px-3 text-[11px] font-medium"
                        >
                          <Play className="size-3" />
                          Play Again
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleShareResult}
                          className="h-7 gap-1.5 px-3 text-[11px]"
                        >
                          <Share2 className="size-3" />
                          Share
                        </Button>
                      </motion.div>
                    </>
                  )}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.6 }}
                    className="mt-3 font-mono text-[11px] text-muted-foreground/40"
                  >
                    New game in {settings.autoResetTimer}s&#8230;
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Keyboard hints */}
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

        {/* Move History */}
        {moveHistory.length > 0 && (
          <Card className="w-full border-border/30 bg-card/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-3 text-muted-foreground/60" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                  Move History
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/30">
                  {moveHistory.length} moves
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndoAll}
                  disabled={undoAllDisabled}
                  className="size-6 ml-1"
                  title="Undo all moves"
                >
                  <Undo2Icon className="size-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {moveHistory.map((move, idx) => {
                  const isAIMove =
                    gameMode === "ai" && move.player === "O";
                  const posLabel = POSITION_LABELS[move.index];
                  const moveTime = gameStartTime
                    ? Math.floor((move.timestamp - gameStartTime) / 1000)
                    : 0;
                  return (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.15,
                        delay: idx === moveHistory.length - 1 ? 0 : undefined,
                      }}
                      className={`inline-flex items-center gap-1 rounded-md border border-border/20 bg-secondary/20 px-1.5 py-0.5 font-mono text-[10px] ${
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
                        &rarr;{posLabel}
                      </span>
                      <span className="text-muted-foreground/30">
                        {formatTime(moveTime)}
                      </span>
                    </motion.span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match History */}
        {gameHistory.length > 0 && (
          <Collapsible
            open={historyOpen}
            onOpenChange={setHistoryOpen}
            className="w-full"
          >
            <Card className="border-border/30 bg-card/20">
              <CollapsibleTrigger className="w-full">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-3 text-muted-foreground/60" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                      Match History
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/30">
                      ({gameHistory.length})
                    </span>
                    <motion.div
                      animate={{ rotate: historyOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-auto"
                    >
                      <ChevronDown className="size-3.5 text-muted-foreground/40" />
                    </motion.div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-3 max-h-64 overflow-y-auto">
                  <div className="flex flex-col gap-1">
                    {gameHistory.map((entry, idx) => {
                      const isXWin = entry.result === "X Won";
                      const isOWin = entry.result === "O Won";
                      const isDraw = entry.result === "Draw";
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.15,
                            delay: idx * 0.03,
                          }}
                          className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[10px] font-mono ${
                            isXWin
                              ? "bg-emerald-500/8 text-emerald-500/80"
                              : isOWin
                                ? "bg-amber-500/8 text-amber-500/80"
                                : "bg-muted/30 text-muted-foreground/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground/30 w-4">
                              #{entry.id}
                            </span>
                            <span className="uppercase">{entry.mode === "ai" ? "vs AI" : "2P"}</span>
                            <Separator
                              orientation="vertical"
                              className="h-3"
                            />
                            <span className="font-medium">
                              {entry.result}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground/50">
                            <span>{entry.moveCount}m</span>
                            <span>{formatTime(entry.duration)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGameHistory([])}
                      className="h-6 gap-1 px-2 text-[10px] text-muted-foreground/40 hover:text-destructive/60"
                    >
                      <Trash2 className="size-2.5" />
                      Clear History
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Game Statistics */}
        <Card className="w-full border-border/30 bg-card/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="size-3 text-muted-foreground/60" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                Game Statistics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* X Win Rate */}
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="size-3 text-emerald-500/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                      X Win Rate
                    </span>
                  </div>
                  <MiniSparkline
                    values={gameHistory.slice(0, 5).map((g) =>
                      g.result === "X Won" ? 1 : 0
                    )}
                    color="#10b981"
                  />
                </div>
                <span className="text-lg font-bold tabular-nums text-gradient">
                  {winRateX}%
                </span>
              </div>

              {/* O Win Rate */}
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="size-3 text-amber-500/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                      O Win Rate
                    </span>
                  </div>
                  <MiniSparkline
                    values={gameHistory.slice(0, 5).map((g) =>
                      g.result === "O Won" ? 1 : 0
                    )}
                    color="#f59e0b"
                  />
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {winRateO}%
                </span>
              </div>

              {/* Average Moves */}
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="size-3 text-sky-500/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                      Avg Moves
                    </span>
                  </div>
                  <MiniSparkline
                    values={gameHistory.slice(0, 5).map((g) => g.moveCount)}
                    color="#38bdf8"
                  />
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {avgMoves}
                </span>
              </div>

              {/* Longest Game */}
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Flame className="size-3 text-rose-500/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                      Longest Game
                    </span>
                  </div>
                  <MiniSparkline
                    values={gameHistory.slice(0, 5).map((g) => g.moveCount)}
                    color="#f43f5e"
                  />
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {longestGame > 0 ? `${longestGame} moves` : "\u2014"}
                </span>
              </div>

              {/* Total Moves */}
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

              {/* X Streak */}
              <div className="stat-card rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="size-3 text-amber-500/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
                      X Streak
                    </span>
                  </div>
                  <MiniSparkline
                    values={gameHistory.slice(0, 5).map((g) =>
                      g.result === "X Won" ? 1 : 0
                    )}
                    color="#f59e0b"
                  />
                </div>
                <span className="text-lg font-bold tabular-nums">
                  {winStreak > 0 ? `${winStreak} \u{1F525}` : "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
