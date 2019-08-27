function ants(state) {
  function create() {
    const { x, y } = state.parameters.initial;
    if (typeof x === 'number' && typeof y === 'number' && x >= 0 && y >= 0 && x < state.width && y < state.height) {
      state.ants.push({
        health: 1,
        x,
        y,
      });
    }
  }

  function isInside(ant) {
    return ant.x >= 0 && ant.x < state.width && ant.y >= 0 && ant.y < state.height;
  }

  function isFree(ant) {
    return !state.cells[JSON.stringify({ x: ant.x, y: ant.y })].obstacle;
  }

  function isAvailable(ant) {
    return isInside(ant) && isFree(ant);
  }

  function getLivingAnts() {
    return state.ants.filter(ant => ant.health > 0);
  }

  function readPheromones(x, y) {
    const cell = state.cells[JSON.stringify({ x, y })];

    return cell ? cell.pheromones : 0;
  }

  function moveAll() {
    getLivingAnts().forEach((ant, i) => {
      const newAnt = { ...ant };
      const isHorizontalDirection = Math.random() < 0.5;
      const delta = 0.1;
      if (isHorizontalDirection) {
        const plusProbability = (readPheromones(ant.x + 1, ant.y) + 1) * Math.random();
        const minusProbability = (readPheromones(ant.x - 1, ant.y) + 1) * Math.random();
        if (plusProbability > minusProbability + delta) {
          newAnt.x++;
        } else if (minusProbability > plusProbability + delta) {
          newAnt.x--;
        }
      } else {
        const plusProbability = (readPheromones(ant.x, ant.y + 1) + 1) * Math.random();
        const minusProbability = (readPheromones(ant.x, ant.y - 1) + 1) * Math.random();
        if (plusProbability > minusProbability + delta) {
          newAnt.y++;
        } else if (minusProbability > plusProbability + delta) {
          newAnt.y--;
        }
      }

      if (isAvailable(newAnt)) {
        state.ants[i] = newAnt;
      }
    });
  }

  function eat() {
    getLivingAnts().forEach((ant) => {
      const cell = state.cells[JSON.stringify({ x: ant.x, y: ant.y })];
      const oldFood = cell.food;
      cell.food = Math.max(0, cell.food - state.parameters.foodEating);
      const newFood = cell.food;
      ant.health += (oldFood - newFood) * state.parameters.healthFromFood;
    });
  }

  function putPheromones() {
    getLivingAnts().forEach((ant) => {
      const cell = state.cells[JSON.stringify({ x: ant.x, y: ant.y })];
      cell.pheromones += state.parameters.pheromonesAtOnce;
    });
  }

  function decreasePheromones() {
    for (let y = 0; y < state.height; y++) {
      for (let x = 0; x < state.width; x++) {
        const cell = state.cells[JSON.stringify({ x, y })];
        cell.pheromones = Math.max(0, cell.pheromones - state.parameters.pheromonesEvaporation);
      }
    }
  }

  function damageAll() {
    state.ants.forEach((ant) => {
      ant.health -= state.parameters.damage;
    });
  }

  create();
  moveAll();
  eat();
  putPheromones();
  decreasePheromones();
  damageAll();
}

export default ants;
