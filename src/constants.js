const CANVAS_SIZE = [810, 720];
const SNAKE_START = [
  [11, 10],
  [11, 11],
];
const FOOD_START = [11, 5];
const SCALE = 30;
const SPEED = 200;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
};

export { CANVAS_SIZE, SNAKE_START, FOOD_START, SCALE, SPEED, DIRECTIONS };
