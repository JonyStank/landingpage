"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Undo2, Keyboard, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type CellValue = "X" | "O" | null;
type Board = CellValue[];
type GameStatus = "playing" | "won" | "draw";

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

function getStatusText(status: GameStatus, currentPlayer: CellValue): string {
  if (status === "draw") return "Draw";
  if (status === "won") return `Player ${currentPlayer === "X" ? "O" : "X"} Wins`;
  return `Player ${currentPlayer}'s Turn`;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X");
  const [winLine, setWinLine] = useState<number[]>([]);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [moveHistory, setMoveHistory] = useState<{ player: CellValue; index: number }[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [selectedCell, setSelectedCell] = useState<number | null>(4);
  const boardRef = useRef<HTMLDivElement>(null);

  const status = getGameStatus(board);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || status !== "playing") return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      const newHistory = [...moveHistory, { player: currentPlayer, index }];

      setBoard(newBoard);
      setMoveHistory(newHistory);

      const result = checkWinner(newBoard);
      if (result) {
        setWinLine(result.line);
        setScore((prev) => ({
          ...prev,
          [result.winner!]: prev[result.winner as "X" | "O"] + 1,
        }));
        setGamesPlayed((prev) => prev + 1);
      } else if (newBoard.every((cell) => cell !== null)) {
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
        setGamesPlayed((prev) => prev + 1);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    },
    [board, currentPlayer, status, moveHistory]
  );

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return;
    const newHistory = [...moveHistory];
    const lastMove = newHistory.pop()!;
    const newBoard = [...board];
    newBoard[lastMove.index] = null;

    setBoard(newBoard);
    setMoveHistory(newHistory);
    setCurrentPlayer(lastMove.player);
    setWinLine([]);
    setSelectedCell(lastMove.index);
  }, [board, moveHistory]);

  const handleReset = useCallback(() => {
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (status !== "playing") return;

      const keyMap: Record<string, [number, number]> = {
        "1": [0, 0], "2": [0, 1], "3": [0, 2],
        "4": [1, 0], "5": [1, 1], "6": [1, 2],
        "7": [2, 0], "8": [2, 1], "9": [2, 2],
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
    [status, selectedCell, handleCellClick, handleUndo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const statusText = getStatusText(status, currentPlayer);

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
          <h1 className="mb-1 text-2xl font-bold tracking-tight glow-text">Tic-Tac-Toe</h1>
          <p className="text-sm text-muted-foreground font-mono">Classic strategy game</p>
        </div>

        <div className="flex w-full items-center gap-3">
          <Card className="flex-1 border-border/40 bg-card/40">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5 text-sm">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Player X</span>
                    <span className="text-2xl font-bold tabular-nums">{score.X}</span>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Draw</span>
                    <span className="text-2xl font-bold tabular-nums text-muted-foreground">{score.draw}</span>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Player O</span>
                    <span className="text-2xl font-bold tabular-nums">{score.O}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUndo}
                    disabled={moveHistory.length === 0 || status !== "playing"}
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                {status === "won" && <Trophy className="size-4 text-amber-500" />}
                {statusText}
              </motion.div>
            )}
          </AnimatePresence>

          {status === "playing" && (
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span
                className="inline-block size-5 rounded border border-border/50 text-center text-xs font-bold leading-5"
                style={{ color: currentPlayer === "X" ? "var(--foreground)" : "var(--muted-foreground)" }}
              >
                {currentPlayer}
              </span>
              {statusText}
            </div>
          )}

          <div ref={boardRef} className="grid grid-cols-3 gap-1.5 rounded-xl border border-border/30 bg-secondary/10 p-2.5">
            {board.map((cell, index) => {
              const isWinCell = winLine.includes(index);
              const isSelected = selectedCell === index && status === "playing" && !cell;
              const row = Math.floor(index / 3);
              const col = index % 3;
              return (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleCellClick(index)}
                  onMouseEnter={() => setSelectedCell(index)}
                  disabled={!!cell || status !== "playing"}
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
                        transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                        className={cell === "X" ? "text-foreground" : "text-muted-foreground/80"}
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

        <div className="flex w-full items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Keyboard className="size-3" />
            <span>Arrow keys + Enter to play</span>
          </div>
          <span className="font-mono">Games: {gamesPlayed}</span>
        </div>

        {moveHistory.length > 0 && (
          <Card className="w-full border-border/30 bg-card/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-3 text-muted-foreground/60" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60">Move History</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {moveHistory.map((move, idx) => {
                  const row = Math.floor(move.index / 3) + 1;
                  const col = (move.index % 3) + 1;
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-0.5 rounded-md border border-border/20 bg-secondary/20 px-1.5 py-0.5 font-mono text-[10px] ${
                        move.player === "X"
                          ? "text-foreground/70"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      <span className="font-bold">{move.player}</span>
                      <span className="text-muted-foreground/40">({row},{col})</span>
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
