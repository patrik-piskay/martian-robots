const orientationOptions = require('./orientationOptions');

class World {
    constructor(x, y) {
        this.grid = {
            x,
            y,
            movedOffPoints: [],
        };
    }

    /**
     * Checks if the point [x, y] is part of the grid
     */
    isOnGrid(x, y) {
        return (
            x >= 0 &&
            x <= this.grid.x &&
            y >= 0 &&
            y <= this.grid.y
        );
    }

    /**
     * Checks if robot can move off the edge
     */
    canMoveOff(x, y) {
        return this.grid.movedOffPoints.indexOf(this._getPointKey(x, y)) === -1;
    }

    /**
     * Marks the x,y pair so the next robot won't move off the edge from the point [x, y]
     */
    addNewMovedOffPoint(x, y) {
        this.grid.movedOffPoints.push(this._getPointKey(x, y));
    }

    /**
     * Generates a unique key for each x, y pair
     */
    _getPointKey(x, y) {
        return `${x}x${y}`;
    }
}

class Robot {
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
    }

    turnRight() {
        const currentIndex = orientationOptions.indexOf(this.orientation);

        this.orientation = currentIndex !== 0 ?
            orientationOptions[currentIndex - 1] :
            orientationOptions[orientationOptions.length - 1];
    }

    turnLeft() {
        const currentIndex = orientationOptions.indexOf(this.orientation);

        this.orientation = currentIndex !== orientationOptions.length - 1 ?
            orientationOptions[currentIndex + 1] :
            orientationOptions[0];
    }

    goForward() {
        const { x, y } = this.calculateNextPosition();
        this.x = x;
        this.y = y;
    }

    calculateNextPosition() {
        switch (this.orientation) {
            case 'N':
                return { x: this.x, y: this.y + 1 };

            case 'W':
                return { x: this.x - 1, y: this.y };

            case 'S':
                return { x: this.x, y: this.y - 1 };

            case 'E':
                return { x: this.x + 1, y: this.y };
        }
    }
}

/**
 * Processes instructions, returns information about whether a robot got lost or not
 */
function processInstructions(world, robot, instructions) {
    const instructionSteps = instructions.split('');
    let isLost = false;

    for (let i = 0; i < instructionSteps.length; i++) {
        const step = instructionSteps[i];

        switch (step.toUpperCase()) {
            case 'L':
                robot.turnLeft();
                break;

            case 'R':
                robot.turnRight();
                break;

            case 'F':
                const { x: nextX, y: nextY } = robot.calculateNextPosition();

                if (!world.isOnGrid(nextX, nextY)) {
                    if (world.canMoveOff(robot.x, robot.y)) {
                        isLost = true;
                        world.addNewMovedOffPoint(robot.x, robot.y);
                    }
                } else {
                    robot.goForward();
                }
                break;

            default:
                throw new Error(`Invalid instruction '${step}'`);
        }

        if (isLost) break;
    }

    return isLost;
}

module.exports = {
    World,
    Robot,
    processInstructions,
};