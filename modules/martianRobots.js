const orientationOptions = require('./orientationOptions');

// World functions

function initWorld(x, y) {
    return {
        x,
        y,
        movedOffPoints: [],
    };
}

/**
 * Checks if the point [pointX, pointY] is part of the grid
 */
function isOnGrid(world, pointX, pointY) {
    return (
        pointX >= 0 &&
        pointX <= world.x &&
        pointY >= 0 &&
        pointY <= world.y
    );
}

/**
 * Generates a unique key for each x, y pair
 */
function getPointKey(x, y) {
    return `${x}x${y}`;
}

/**
 * Checks if robot can move off the edge from the point [x, y]
 */
function canMoveOff(world, x, y) {
    return world.movedOffPoints.indexOf(getPointKey(x, y)) === -1;
}

/**
 * Marks the x,y pair so the next robot won't move off the edge from the point [x, y]
 */
function addNewMovedOffPoint(world, x, y) {
    const newMovedOffPoints = JSON.parse(JSON.stringify(world.movedOffPoints));
    newMovedOffPoints.push(getPointKey(x, y));

    return Object.assign({}, world, {
        movedOffPoints: newMovedOffPoints,
    });
}

// Robot functions

function createRobot(x, y, orientation) {
    return {
        x,
        y,
        orientation,
    };
}

/**
 * Turns the robot to the right
 */
function turnRight(robot) {
    const currentIndex = orientationOptions.indexOf(robot.orientation);

    const newOrientation = currentIndex !== 0 ?
        orientationOptions[currentIndex - 1] :
        orientationOptions[orientationOptions.length - 1];

    return Object.assign({}, robot, {
        orientation: newOrientation,
    });
}

/**
 * Turns the robot to the left
 */
function turnLeft(robot) {
    const currentIndex = orientationOptions.indexOf(robot.orientation);

    const newOrientation = currentIndex !== orientationOptions.length - 1 ?
        orientationOptions[currentIndex + 1] :
        orientationOptions[0];

    return Object.assign({}, robot, {
        orientation: newOrientation,
    });
}

/**
 * Moves the robot forward
 */
function goForward(robot) {
    const { x, y } = calculateNextPosition(robot);

    return Object.assign({}, robot, {
        x,
        y,
    });
}

/**
 * Calculates the next coordinates based on the robot's orientation
 */
function calculateNextPosition(robot) {
    switch (robot.orientation) {
        case 'N':
            return { x: robot.x, y: robot.y + 1 };

        case 'W':
            return { x: robot.x - 1, y: robot.y };

        case 'S':
            return { x: robot.x, y: robot.y - 1 };

        case 'E':
            return { x: robot.x + 1, y: robot.y };
    }
}

// Main

function createWorld(x, y) {
    let world = initWorld(x, y);

    return function processInstructions(robot, instructions) {
        const initialModel = {
            world,
            robot,
            isRobotLost: false,
        };
        const instructionSteps = instructions.toUpperCase().split('');

        // process instructions, returning a new model after every instruction step
        const newModel = instructionSteps.reduce((model, instruction) => {
            // don't process further if the robot is already lost
            if (model.isRobotLost) return model;

            switch (instruction) {
                case 'L':
                    return Object.assign({}, model, {
                        robot: turnLeft(model.robot),
                    });

                case 'R':
                    return Object.assign({}, model, {
                        robot: turnRight(model.robot),
                    });

                case 'F':
                    const { x: nextX, y: nextY } = calculateNextPosition(model.robot);

                    if (!isOnGrid(model.world, nextX, nextY)) {
                        let newWorld = model.world;
                        let isRobotLost = false;

                        // robot is about to move off the grid,
                        // check if the point is protected against it
                        if (canMoveOff(model.world, model.robot.x, model.robot.y)) {
                            isRobotLost = true;
                            newWorld = addNewMovedOffPoint(model.world, model.robot.x, model.robot.y);
                        }

                        return Object.assign({}, model, {
                            world: newWorld,
                            isRobotLost,
                        });
                    } else {
                        // not moving off the grid, moving forward then
                        return Object.assign({}, model, {
                            robot: goForward(model.robot),
                        });
                    }

                default:
                    throw new Error(`Invalid instruction '${instruction}'`);
            }
        }, initialModel);

        // update the world for the next robot run
        world = newModel.world;

        return newModel;
    };
}

module.exports = {
    createWorld,
    createRobot,
    // for testing
    turnLeft,
    turnRight,
    goForward,
};
