"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Minus } from "lucide-react";
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

function getGameStatus(board: Board, currentPlayer: CellValue): GameStatus {
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
  const [moveHistory, setMoveHistory] = useState<number[]>([]);

  const status = getGameStatus(board, currentPlayer);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || status !== "playing") return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      const newHistory = [...moveHistory, index];

      setBoard(newBoard);
      setMoveHistory(newHistory);

      const result = checkWinner(newBoard);
      if (result) {
        setWinLine(result.line);
        setScore((prev) => ({
          ...prev,
          [result.winner!]: prev[result.winner as "X" | "O"] + 1,
        }));
      } else if (newBoard.every((cell) => cell !== null)) {
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
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
    newBoard[lastMove] = null;

    setBoard(newBoard);
    setMoveHistory(newHistory);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setWinLine([]);
  }, [board, currentPlayer, moveHistory]);

  const handleReset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinLine([]);
    setMoveHistory([]);
  }, []);

  useEffect(() => {
    if (status !== "playing") {
      const timer = setTimeout(() => {
        handleReset();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, handleReset]);

  const statusText = getStatusText(status, currentPlayer);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col items-center gap-6"
      >
        <div className="text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight">Tic-Tac-Toe</h1>
          <p className="text-sm text-muted-foreground font-mono">Classic strategy game</p>
        </div>

        <Card className="w-full border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs text-muted-foreground">X</span>
                  <span className="text-lg font-bold">{score.X}</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs text-muted-foreground">Draw</span>
                  <span className="text-lg font-bold text-muted-foreground">{score.draw}</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs text-muted-foreground">O</span>
                  <span className="text-lg font-bold">{score.O}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={moveHistory.length === 0 || status !== "playing"}
                  className="size-8"
                >
                  <Minus className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="size-8"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <AnimatePresence mode="wait">
            {status !== "playing" && (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-secondary/50 px-4 py-2 text-sm font-medium"
              >
                {status === "won" && <Trophy className="size-4" />}
                {statusText}
              </motion.div>
            )}
          </AnimatePresence>

          {status === "playing" && (
            <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
              {statusText}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => {
              const isWinCell = winLine.includes(index);
              return (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || status !== "playing"}
                  className={`flex size-24 items-center justify-center rounded-lg border text-2xl font-bold transition-all duration-200 sm:size-28 ${
                    isWinCell
                      ? "border-primary/50 bg-primary/10"
                      : cell
                        ? "border-border/30 bg-secondary/20"
                        : "border-border/50 bg-card/30 hover:border-border hover:bg-secondary/30"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {cell && (
                      <motion.span
                        key={cell + index}
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className={cell === "X" ? "text-foreground" : "text-muted-foreground"}
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

        <p className="text-center text-xs text-muted-foreground">
          Click a cell to place your mark
        </p>
      </motion.div>
    </main>
  );
}
