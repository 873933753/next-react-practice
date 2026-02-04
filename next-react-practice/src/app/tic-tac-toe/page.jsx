"use client"

import './style.css';
import { useState } from 'react';

function Square({value,onSquareClick}){
  return(
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

// 计算胜利，不再继续
function CalculateWinner(squares){
  const results = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < results.length; i++) {
    const [a, b, c] = results[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Board(){
  const [status, setStatus ] = useState('next:X')
  const [squares, setSquares] = useState(Array(9).fill(null))
  let winnerStatus = CalculateWinner(squares)
  const handleClick = (index) => {
    // 统计已经点击的数量
    let currentValue = 'X';
    const valueNums = squares.filter(value => value!==null).length;   
    if(valueNums > 3 && winnerStatus){ // 已经胜出不再继续
      return
    }

    if(valueNums % 2 !== 0){
      currentValue = "O"
      setStatus('next:X')
    }else{
      setStatus('next:O')
    }
    const newSquares = squares.slice()
    newSquares[index] = currentValue;
    setSquares(newSquares);
    if(CalculateWinner(newSquares)){
      setStatus(`winner:${CalculateWinner(newSquares)}`)
    }
  }
  
  
  return(
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}