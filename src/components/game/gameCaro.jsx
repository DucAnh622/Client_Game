import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Caro = () => {
  const navigate = useNavigate();
  const [gameStatus, setGameStatus] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const account = useSelector((state) => state.user.account);
  const [board, setBoard] = useState(
    Array(15).fill().map(() => Array(15).fill(null))
  );
  const [symbol, setSymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isMoveInProgress, setIsMoveInProgress] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    if (isSocketConnected) {
      socketRef.current = io("http://localhost:8080");

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socketRef.current.emit("joinGame", { username: account.username });

      socketRef.current.on("waitingForOpponent", (message) => {
        setGameStatus(message);
      });

      socketRef.current.on("gameStart", ({ opponent, symbol, gameId }) => {
        setGameStatus("Game Started");
        setOpponent(opponent);
        setSymbol(symbol);
        setGameId(gameId);
        setIsMyTurn(symbol === "X");
      });

      socketRef.current.on("moveMade", ({ row, col, symbol }) => {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[row][col] = symbol;
          return newBoard;
        });
        setIsMyTurn(symbol !== setSymbol); 
      });

      socketRef.current.on("gameEnd", ({ winner }) => {
        if (winner === "draw") {
          toast.info("Game ended in a draw!");
        } else {
          winner === symbol ?
          toast.success("You won!") 
          :
          toast.error("You lost!");
        }
        setTimeout(() => setGameStatus(false), 2000);
      });

      socketRef.current.on("opponentDisconnected", () => {
        toast.error("Opponent disconnected!");
        setTimeout(() => setGameStatus(false), 2000);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off("waitingForOpponent");
          socketRef.current.off("gameStart");
          socketRef.current.off("moveMade");
          socketRef.current.off("gameEnd");
          socketRef.current.off("opponentDisconnected");
          socketRef.current.disconnect(); 
        }
      };
    }
  }, [isSocketConnected, navigate, account, symbol]);

  const handleClick = (row, col) => {
    if (!socketRef.current || !socketRef.current.connected) {
      toast.error("Socket is not connected!");
      return;
    }

    if (board[row][col] === null && gameId && isMyTurn && !isMoveInProgress) {
      setIsMoveInProgress(true);
      socketRef.current.emit("makeMove", { gameId, row, col, symbol });
      setIsMyTurn(false);
      setTimeout(() => setIsMoveInProgress(false), 1000);
    } else if (!isMyTurn) {
      toast.warning("It's not your turn. Please wait.");
    } else if (board[row][col] !== null) {
      toast.warning("This spot is already taken!");
    }
  };

  const handlePlay = () => {
    if (account && account.loading === false) {
      toast.warning("Please log in to play!");
      return;
    } else {
      setIsSocketConnected(true);
    }
  };

  const handleExit = () => {
    setGameStatus(false);
    navigate("/");
    setBoard(Array(15).fill().map(() => Array(15).fill(null))); 
    setSymbol(null);
    setGameId(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="d-flex">
        {row.map((cell, colIndex) => (
          <button
            key={colIndex}
            className={`btn m-1 ${cell === "X" ? "btn-primary" : cell === "O" ? "btn-danger" : "btn-outline-primary"}`}
            style={{
              width: "40px",
              height: "40px",
              borderColor: cell === "X" ? "#007bff" : cell === "O" ? "#dc3545" : "#6c757d",
            }}
            onClick={() => handleClick(rowIndex, colIndex)}
            disabled={cell !== null || !isMyTurn}
          >
            {cell}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="container text-center mt-5">
      <h1>Caro Game</h1>
      {gameStatus === false ? (
        <>
          <button onClick={handlePlay} className="btn btn-primary w-25 mb-2">
            Play Online
          </button>
          <br />
          <button onClick={handleExit} className="btn btn-danger w-25">
            Exit
          </button>
        </>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-between w-75 mb-3">
            <div className="user">
              <p>{account.username}</p>
            </div>
            <div className="user">
              <p>{opponent}</p>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center w-75">
            <div className="board-container">{renderBoard()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caro;

