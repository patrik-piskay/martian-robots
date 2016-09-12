const orientationOptions = require('./orientationOptions');

function validateWorldConfig(worldX, worldY) {
    if (!Number.isInteger(worldX) || !Number.isInteger(worldY)) {
        throw new Error('2 integers are expected as coordinates');
    }

    if (worldX < 0 || worldY < 0) {
        throw new Error('World coordinates should be positive integers');
    }

    if (worldX > 50 || worldY > 50) {
        throw new Error('Maximum value for world\'s coordinate is 50');
    }
}

function validateRobotConfig(robotX, robotY, robotOrientation, world) {
    if (!Number.isInteger(robotX) || !Number.isInteger(robotY)) {
        throw new Error('2 integers are expected as coordinates');
    }
    if (robotX > world.x || robotY > world.y) {
        throw new Error('Robot is placed outside of the specified world');
    }
    if (!robotOrientation || orientationOptions.indexOf(robotOrientation.toUpperCase()) === -1) {
        throw new Error(`Invalid orientation '${robotOrientation}'`);
    }
}

function validateInstructions(instructions) {
    if (instructions.length > 100) {
        throw new Error(`Maximum instruction length is 100 characters, ${instructions.length} characters were entered`);
    }
}

module.exports = {
    validateWorldConfig,
    validateRobotConfig,
    validateInstructions,
};
