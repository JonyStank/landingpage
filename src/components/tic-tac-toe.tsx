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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// ── Web Audio API Sound Effects ─────────────────────────────────────────

const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, volume: number = 0.08, type: OscillatorType = "sine") {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
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

// ── Minimax AI ────────────────────────────────────────────────────────────

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
  const emptyCells = board.filter((c) => c === null).length;

  switch (difficulty) {
    case "easy":
      return getRandomMove(board);

    case "medium":
      // Play optimally 50% of the time, randomly 50% — but always take a win
      if (Math.random() < 0.5) return getBestMove(board);
      // Check if AI can win immediately (always take it)
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
      // Check if player can win next (always block on first few moves for some intelligence)
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

// ── Component ─────────────────────────────────────────────────────────────

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [moveHistory, setMoveHistory] = useState<
    { player: CellValue; index: number }[]
  >([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [selectedCell, setSelectedCell] = useState<number | null>(4);
  const [gameMode, setGameMode] = useState<GameMode>("2p");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [aiThinking, setAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = getGameStatus(board);

  // Resume AudioContext on first user interaction (autoplay policy)
  const resumeAudio = useCallback(() => {
    if (audioCtx?.state === "suspended") {
      audioCtx.resume();
    }
  }, []);

  // Clean up AI timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  // ── Core game logic ────────────────────────────────────────────────────

  const applyMove = useCallback(
    (
      boardState: Board,
      historyState: { player: CellValue; index: number }[],
      player: CellValue,
      index: number
    ): {
      newBoard: Board;
      newHistory: { player: CellValue; index: number }[];
      gameOver: boolean;
      winResult: { winner: CellValue; line: number[] } | null;
      isDraw: boolean;
    } => {
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
      isDraw: boolean
    ) => {
      if (winResult) {
        if (soundEnabled) playWinSound();
        setWinLine(winResult.line);
        setScore((prev) => ({
          ...prev,
          [winResult.winner!]: prev[winResult.winner as "X" | "O"] + 1,
        }));
        setGamesPlayed((prev) => prev + 1);
      } else if (isDraw) {
        if (soundEnabled) playDrawSound();
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
        setGamesPlayed((prev) => prev + 1);
      }
    },
    [soundEnabled]
  );

  // Trigger AI move
  const triggerAIMove = useCallback(
    (currentBoard: Board) => {
      setAiThinking(true);
      aiTimeoutRef.current = setTimeout(() => {
        setBoard((prevBoard) => {
          const move = getAIMove([...prevBoard], difficulty);
          if (move === -1) return prevBoard;

          const { newBoard, newHistory, winResult, isDraw } = applyMove(
            prevBoard,
            [],
            "O",
            move
          );

          // We need to update history and game end state
          // Since we're inside setBoard, we use a microtask approach
          setTimeout(() => {
            setMoveHistory(newHistory);
            if (soundEnabled) playMoveSound();
            if (winResult || isDraw) {
              finishGame(winResult, isDraw);
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
      // In AI mode, block input during AI's turn
      if (gameMode === "ai" && (currentPlayer !== "X" || aiThinking)) return;

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
        finishGame(winResult, isDraw);
      } else {
        const nextPlayer = currentPlayer === "X" ? "O" : "X";
        setCurrentPlayer(nextPlayer);

        // Trigger AI move if switching to O in AI mode
        if (gameMode === "ai" && nextPlayer === "O") {
          triggerAIMove(newBoard);
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

    // In AI mode, undo must undo both the AI move and the player move
    if (gameMode === "ai") {
      // Block undo during AI thinking
      if (aiThinking) return;
      // Must have at least 2 moves (player + AI) to undo
      if (moveHistory.length < 2) return;

      // Cancel pending AI move
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
        setAiThinking(false);
      }

      // Undo AI move and player move
      const newBoard = [...board];
      for (let i = 0; i < 2; i++) {
        const move = moveHistory[moveHistory.length - 1 - i];
        newBoard[move.index] = null;
      }

      setBoard(newBoard);
      setMoveHistory(moveHistory.slice(0, -2));
      setCurrentPlayer("X");
      setWinLine([]);
      setSelectedCell(
        moveHistory[moveHistory.length - 2]?.index ?? null
      );
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
    }
  }, [board, moveHistory, status, gameMode, aiThinking, soundEnabled]);

  const handleReset = useCallback(() => {
    // Cancel any pending AI move
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
  }, []);

  const handleFullReset = useCallback(() => {
    handleReset();
    setScore({ X: 0, O: 0, draw: 0 });
    setGamesPlayed(0);
  }, [handleReset]);

  useEffect(() => {
    if (status !== "playing") {
      const timer = setTimeout(() => {
        handleReset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, handleReset]);

  // ── Keyboard ───────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status !== "playing") return;
      // Block keyboard input during AI thinking in AI mode
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
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Helpers ────────────────────────────────────────────────────────────

  const statusText = getStatusText(status, currentPlayer, gameMode);
  const isAiTurn =
    gameMode === "ai" && currentPlayer === "O" && status === "playing";
  const undoDisabled =
    moveHistory.length === 0 ||
    status !== "playing" ||
    (gameMode === "ai" && (aiThinking || moveHistory.length < 2));

  // ── Render ─────────────────────────────────────────────────────────────

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

        {/* ── Mode & Difficulty Toggle ──────────────────────────────── */}
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

        {/* ── Scoreboard ─────────────────────────────────────────────── */}
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
                    title="New Game"
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
                    {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Game Board ─────────────────────────────────────────────── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {status !== "playing" && (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-secondary/30 px-5 py-2.5 text-sm font-medium backdrop-blur-sm"
              >
                {status === "won" && (
                  <Trophy className="size-4 text-amber-500" />
                )}
                {statusText}
              </motion.div>
            )}
          </AnimatePresence>

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
                      animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0.2, 0.7] }}
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
                <>
                  <span
                    className="inline-block size-5 rounded border border-border/50 text-center text-xs font-bold leading-5"
                    style={{
                      color:
                        currentPlayer === "X"
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {currentPlayer}
                  </span>
                  {statusText}
                </>
              )}
            </div>
          )}

          <div
            ref={boardRef}
            className="grid grid-cols-3 gap-1.5 rounded-xl border border-border/30 bg-secondary/10 p-2.5"
          >
            {board.map((cell, index) => {
              const isWinCell = winLine.includes(index);
              const isSelected =
                selectedCell === index && status === "playing" && !cell;
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
                    (gameMode === "ai" && (currentPlayer !== "X" || aiThinking))
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

        {/* ── Footer hints ───────────────────────────────────────────── */}
        <div className="flex w-full items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Keyboard className="size-3" />
            <span>Arrow keys + Enter to play</span>
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

        {/* ── Move History ───────────────────────────────────────────── */}
        {moveHistory.length > 0 && (
          <Card className="w-full border-border/30 bg-card/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-3 text-muted-foreground/60" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">
                  Move History
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {moveHistory.map((move, idx) => {
                  const row = Math.floor(move.index / 3) + 1;
                  const col = (move.index % 3) + 1;
                  const isAIMove =
                    gameMode === "ai" && move.player === "O";
                  return (
                    <span
                      key={idx}
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
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </main>
  );
}
