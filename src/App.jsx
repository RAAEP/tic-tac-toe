import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Square } from './components/Square';
import { TURNS } from './constants';
import { checkWinnerFrom, checkEndGame } from './logic/board';
import { WinnerModal } from './components/WinnerModal';
import { resetGameToStorage, saveGameToStorage } from './storage';


function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  });
  const [turn, setTurno] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? turnFromStorage : TURNS.X
  });
  const [winner, setWinner] = useState(null); // null no tenemos ganador y si es false es un empate



  // Empezar juego de nuevo
  const resetGame = () => {
    // Estos iniciales
    setBoard(Array(9).fill(null));
    setTurno(TURNS.X);
    setWinner(null);

    resetGameToStorage();
  };




  // Actualizar el board
  const updateBoard = (index) => {
    // no actualiza esta posicion
    // si ya tiene algo o tenemos un ganador
    if (board[index] || winner) return;

    // Siempre generar un nuevo array nunca mutar directamen el estado
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurno(newTurn);
    // guardar aqui partida

    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // revisar ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti()
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((squere, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {squere}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
