import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import "./App.scss";
import {
  CANVAS_SIZE,
  SNAKE_START,
  FOOD_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import audioEat from "./sounds/snakeEat.wav";
import audioGameOver from "./sounds/gameOver.wav";
import audioStart from "./sounds/soundBGC.mp3";
import ReactGA from "react-ga";

function App() {
  const audio = document.getElementsByTagName("audio");
  const canvasRef = useRef();
  const checkKeyCode = useRef(38);
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [score, setScore] = useState(0);
  const [pause, setPause] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    ReactGA.initialize("UA-215031408-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  //Khởi tạo canvas bắt đầu game
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "#EC7063";
    context.fillRect(food[0], food[1], 1, 1);
    context.fillStyle = "#3498DB";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
  }, [snake, food, gameOver]);

  // Xử lý di chuyển con rắn
  const moveSnake = (e) => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      //fix bug snake đi ngược
      if (Math.abs(e.keyCode - checkKeyCode.current) !== 2) {
        checkKeyCode.current = e.keyCode;
        setDir(DIRECTIONS[e.keyCode]);
        // console.log(dir);
      }
    }
    // console.log(e.keyCode );
  };

  const handleFoodCollision = () => {
    if (snake[0].toString() === food.toString()) {
      // for (let key of snake) {
      //   console.log(key[1]);
      // }
      //Cộng điểm mỗi lần chạm
      setScore((prev) => prev + 1);
      //random đồ ăn
      setFood([
        Math.floor(Math.random() * (CANVAS_SIZE[0] / SCALE)),
        Math.floor(Math.random() * (CANVAS_SIZE[1] / SCALE)),
      ]);
      // setSnake(snake.push([1]));
      audio[0].play();
      return true;
    }
    return false;
  };

  // Check va chạm => Game Over
  const handleCollision = (collision) => {
    if (
      collision[0][0] < 0 ||
      collision[0][1] < 0 ||
      collision[0][0] * SCALE >= CANVAS_SIZE[0] ||
      collision[0][1] * SCALE >= CANVAS_SIZE[1]
    ) {
      // console.log(snake[0][0] * SCALE);
      endGame();
    }
    // endGame khi tự cắn vào thân
    for (const key of snake) {
      if (collision[0][0] === key[0] && collision[0][1] === key[1]) {
        endGame();
      }
    }
  };

  // Xử lý chương trình chạy game
  const gameLoop = () => {
    let snakeVirtual = JSON.parse(JSON.stringify(snake));
    let newSnakeHead = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
    snakeVirtual.unshift(newSnakeHead);
    if (!handleFoodCollision()) snakeVirtual.pop();
    setSnake(snakeVirtual);
    // handleFoodCollision();
    handleCollision(snakeVirtual);
    // console.log(snake);
  };

  useInterval(gameLoop, speed);
  const startGame = () => {
    ReactGA.event({
      category: "Button",
      action: "Click button Start game",
    });
    setSpeed(SPEED);
    audio[2].play();
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    audio[1].play();
    audio[2].pause();
  };

  const playAgain = () => {
    ReactGA.event({
      category: "Button",
      action: "Click button Play Again",
    });
    setSpeed(SPEED);
    setGameOver(false);
    setFood(FOOD_START);
    setSnake(SNAKE_START);
    setDir([0, -1]);
    setScore(0);
    audio[2].play();
  };

  const pauseGame = () => {
    ReactGA.event({
      category: "Button",
      action: "Click button Pause",
    });
    setSpeed(pause ? null : SPEED);
    setPause(!pause);
  };

  return (
    <div className="container" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <canvas
        style={{ border: "5px solid #fff" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />

      <div className="right">
        <p style={{ margin: "16px 0 0 50px", color: "#fff" }}>Dashboard:</p>
        <div className="dashboard">
          <p>
            <i className="fas fa-long-arrow-alt-up"></i>
            Top
          </p>
          <p>
            <i className="fas fa-long-arrow-alt-left"></i>
            Left
          </p>
          <p>
            <i className="fas fa-long-arrow-alt-down"></i>
            Bottom
          </p>
          <p>
            <i className="fas fa-long-arrow-alt-right"></i>
            Right
          </p>
        </div>
        <div className="control">
          {gameOver && <div className="gameOver">GAME OVER!</div>}
          <p className="score">SCORE: {score}</p>
          <div className="button">
            <button onClick={startGame} disabled={gameOver}>
              Start Game
            </button>
            <button onClick={playAgain}>Play again</button>
            <button className="pause" onClick={pauseGame}>
              Pause
            </button>
          </div>
          <audio autoPlay>
            <source src={audioEat} />
          </audio>
          <audio autoPlay>
            <source src={audioGameOver} />
          </audio>
          <audio autoPlay loop>
            <source src={audioStart} />
          </audio>
        </div>
      </div>
    </div>
  );
}

export default App;
