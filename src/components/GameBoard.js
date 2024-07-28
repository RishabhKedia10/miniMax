import React, { useState, useEffect } from "react";
import Square from "./Square";
import { Box, Typography, Button } from "@mui/material";

const initialBoard = Array(9).fill(null);

const GameBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("First turn is of Player X");

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      makeComputerMove(board);
    }
  }, [isPlayerTurn, board, winner]);

  const handlePlayerMove = (index) => {
    if (!board[index] && !winner && isPlayerTurn) {
      const newBoard = board.slice();
      newBoard[index] = "X";
      setBoard(newBoard);
      setIsPlayerTurn(false);
      setWinner(calculateWinner(newBoard));
      setMessage("Computer's turn");
    }
  };

  const makeComputerMove = (currentBoard) => {
    const bestMove = minimax(currentBoard, "O").index;
    const newBoard = currentBoard.slice();
    newBoard[bestMove] = "O";
    setBoard(newBoard);
    setIsPlayerTurn(true);
    setWinner(calculateWinner(newBoard));
    setMessage("Player X's turn");
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Tie";
  };

  const minimax = (newBoard, currentPlayer) => {
    const availSpots = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (calculateWinner(newBoard) === "X") {
      return { score: -10 };
    } else if (calculateWinner(newBoard) === "O") {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = currentPlayer;

      if (currentPlayer === "O") {
        move.score = minimax(newBoard, "X").score;
      } else {
        move.score = minimax(newBoard, "O").score;
      }

      newBoard[availSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (currentPlayer === "O") {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setWinner(null);
    setMessage("First turn is of Player X");
  };

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Tic-Tac-Toe
      </Typography>
      <Typography variant="h6" id="notice">
        {message}
      </Typography>
      <Box className="container">
        <Box className="game">
          {board.map((value, index) => (
            <Square
              key={index}
              value={value}
              onClick={() => handlePlayerMove(index)}
            />
          ))}
        </Box>
      </Box>
      {winner ? (
        <Box className="msg-container">
          <Typography variant="h6" id="msg">
            {winner === "Tie"
              ? "It's a Tie!"
              : winner === "X"
              ? "You Win!"
              : "You Lose!"}
          </Typography>
          <Button
            id="new-btn"
            onClick={resetGame}
            variant="contained"
            color="primary"
          >
            New Game
          </Button>
        </Box>
      ) : (
        <Button
          id="reset-btn"
          onClick={resetGame}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Reset Game
        </Button>
      )}
    </Box>
  );
};

export default GameBoard;
