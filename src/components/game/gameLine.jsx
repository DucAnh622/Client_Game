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
    const [hintCells, setHintCells] = useState([]);
    const [isHintMode, setIsHintMode] = useState(false);

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
                setHintCells([]); 
            } else {
                setSelectedBall(null);
                setHintCells([]); 
            }
        } else if (grid[row][col] && ballSizes[row][col] === 40) {
            setSelectedBall({ row, col });
            if (isHintMode) {
                setHintCells(getValidMoves(row, col));
            }
        } else if (isHintMode && hintCells.some(hint => hint.row === row && hint.col === col)) {
            setHintCells([]);
            setSelectedBall(null);
            handleCellClick(row, col); 
        }
    };

    const getValidMoves = (row, col) => {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], 
            [-1, -1], [-1, 1], [1, -1], [1, 1] 
        ];
        
        const queue = [{ row, col }];
        const visited = new Set();
        const validMoves = [];
    
        while (queue.length > 0) {
            const { row: r, col: c } = queue.shift();
            
            for (const [dr, dc] of directions) {
                const nr = r + dr, nc = c + dc;
    
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                    if (!grid[nr][nc] && !visited.has(`${nr}-${nc}`)) {
                        queue.push({ row: nr, col: nc });
                        validMoves.push({ row: nr, col: nc });
                        visited.add(`${nr}-${nc}`);
                    }
                }
            }
        }
    
        return validMoves;
    };
    

    const checkLines = (currentGrid) => {
        let newGrid = currentGrid.map(row => [...row]);
        let linesFound = false;

        for (let i = 0; i < GRID_SIZE; i++) {
            let countH = 1;
            let countV = 1;
            for (let j = 1; j < GRID_SIZE; j++) {
                if (newGrid[i][j] && newGrid[i][j] === newGrid[i][j - 1]) {
                    countH++;
                    if (countH >= 5) {
                        linesFound = true;
                        for (let k = 0; k < countH; k++) {
                            newGrid[i][j - k] = null;
                        }
                        setScore(prev => prev + countH * 10);
                    }
                } else {
                    countH = 1;
                }

                if (newGrid[j][i] && newGrid[j][i] === newGrid[j - 1][i]) {
                    countV++;
                    if (countV >= 5) {
                        linesFound = true;
                        for (let k = 0; k < countV; k++) {
                            newGrid[j - k][i] = null;
                        }
                        setScore(prev => prev + countV * 10);
                    }
                } else {
                    countV = 1;
                }
            }
        }

        for (let i = 0; i < GRID_SIZE - 4; i++) {
            for (let j = 0; j < GRID_SIZE - 4; j++) {
                let count = 1;
                for (let k = 1; k < GRID_SIZE && i + k < GRID_SIZE && j + k < GRID_SIZE; k++) {
                    if (newGrid[i + k][j + k] && newGrid[i + k][j + k] === newGrid[i + k - 1][j + k - 1]) {
                        count++;
                        if (count >= 5) {
                            linesFound = true;
                            for (let l = 0; l < count; l++) {
                                newGrid[i + k - l][j + k - l] = null;
                            }
                            setScore(prev => prev + count * 10);
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        for (let i = 0; i < GRID_SIZE - 4; i++) {
            for (let j = GRID_SIZE - 1; j >= 4; j--) {
                let count = 1;
                for (let k = 1; k < GRID_SIZE && i + k < GRID_SIZE && j - k >= 0; k++) {
                    if (newGrid[i + k][j - k] && newGrid[i + k][j - k] === newGrid[i + k - 1][j - k + 1]) {
                        count++;
                        if (count >= 5) {
                            linesFound = true;
                            for (let l = 0; l < count; l++) {
                                newGrid[i + k - l][j - k + l] = null;
                            }
                            setScore(prev => prev + count * 10);
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        if (linesFound) {
            setGrid(newGrid);
            checkLines(newGrid);
        }
    };

    const toggleHintMode = () => {
        setIsHintMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                if (selectedBall) {
                    setHintCells(getValidMoves(selectedBall.row, selectedBall.col));
                }
            } else {
                setHintCells([]);
            }
    
            return newMode;
        });
    };
    
    return (
        <div className="container game1 mt-2 text-center">
            <div className="d-flex align-item-center justify-content-between">
                <h3 style={{minWidth:"180px"}}>Score: {score}</h3>
                <h1>Line 98</h1>
                <button onClick={toggleHintMode} className={isHintMode ? 'btn btn-secondary mb-2':'btn btn-primary mb-2'}>
                    {isHintMode ? 'Disable hint mode' : 'Enable hint mode'}
                </button>
            </div>
            <div className="d-flex justify-content-center">
                <div className="grid">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="d-flex">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`cell ${selectedBall?.row === rowIndex && selectedBall?.col === colIndex ? 'selected' : ''} 
                                    ${hintCells.some(hint => hint.row === rowIndex && hint.col === colIndex) ? 'hint' : ''}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        border: '1px solid #ccc',
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
