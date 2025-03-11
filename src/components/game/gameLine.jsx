import './game1.scss';
import React, { useState, useEffect } from "react";

const Line = () => {
    const GRID_SIZE = 9;
    const COLORS = ["red", "blue", "green", "yellow", "purple"];
    
    const [grid, setGrid] = useState(
        Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null))
    );
    const [selectedBall, setSelectedBall] = useState(null);
    const [score, setScore] = useState(0);
    const [ballSizes, setBallSizes] = useState(
        Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(40))
    );
    
    useEffect(() => {
        addNewBalls(grid, true);
    }, []);

    const addNewBalls = (currentGrid, firstTime = false) => {
        let newGrid = currentGrid.map(row => [...row]);
        let newSizes = ballSizes.map(row => [...row]);
        let added = 0;
        while (added < 3) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            if (!newGrid[row][col]) {
                newGrid[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
                newSizes[row][col] = firstTime ? 40 : 20;
                added++;
            }
        }
        setGrid(newGrid);
        setBallSizes(newSizes);
        checkLines(newGrid);
    };

    const growBalls = () => {
        setBallSizes(prevSizes =>
            prevSizes.map(row => row.map(size => (size < 40 ? size + 5 : size)))
        );
    };

    const handleCellClick = (row, col) => {
        if (selectedBall) {
            if (!grid[row][col]) {
                let newGrid = grid.map(row => [...row]);
                let newSizes = ballSizes.map(row => [...row]);
                newGrid[row][col] = newGrid[selectedBall.row][selectedBall.col];
                newGrid[selectedBall.row][selectedBall.col] = null;
                newSizes[row][col] = newSizes[selectedBall.row][selectedBall.col];
                newSizes[selectedBall.row][selectedBall.col] = 20;
                setGrid(newGrid);
                setBallSizes(newSizes);
                setSelectedBall(null);
                addNewBalls(newGrid);
                growBalls();
                checkLines(newGrid);
            } else {
                setSelectedBall(null);
            }
        } else if (grid[row][col]) {
            setSelectedBall({ row, col });
        }
    };

    const checkLines = (currentGrid) => {
        let newGrid = currentGrid.map(row => [...row]);
        let linesFound = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            let count = 1;
            for (let j = 1; j < GRID_SIZE; j++) {
                if (newGrid[i][j] && newGrid[i][j] === newGrid[i][j - 1]) {
                    count++;
                    if (count >= 5) {
                        linesFound = true;
                        for (let k = 0; k < count; k++) {
                            newGrid[i][j - k] = null;
                        }
                        setScore(prev => prev + count * 10);
                    }
                } else {
                    count = 1;
                }
            }
        }

        for (let j = 0; j < GRID_SIZE; j++) {
            let count = 1;
            for (let i = 1; i < GRID_SIZE; i++) {
                if (newGrid[i][j] && newGrid[i][j] === newGrid[i - 1][j]) {
                    count++;
                    if (count >= 5) {
                        linesFound = true;
                        for (let k = 0; k < count; k++) {
                            newGrid[i - k][j] = null;
                        }
                        setScore(prev => prev + count * 10);
                    }
                } else {
                    count = 1;
                }
            }
        }

        if (linesFound) {
            setGrid(newGrid);
            checkLines(newGrid);
        }
    };

    return (
        <div className="container game1 mt-2 text-center">
            <h1>Line 98</h1>
            <h3>Score: {score}</h3>
            <div className="d-flex justify-content-center">
                <div className="grid">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="d-flex">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`cell ${selectedBall?.row === rowIndex && selectedBall?.col === colIndex ? 'selected' : ''}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        border: '1px solid black',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {cell && (
                                        <div
                                            style={{
                                                width: `${ballSizes[rowIndex][colIndex]}px`,
                                                height: `${ballSizes[rowIndex][colIndex]}px`,
                                                backgroundColor: cell,
                                                borderRadius: '50%',
                                                transition: 'width 0.3s, height 0.3s',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <p className="mt-3">Click a ball to select, then click an empty cell to move if path exists.</p>
        </div>
    );
}

export default Line;



