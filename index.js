const interactiveScript = require('interactive-script');
const chalk = require('chalk');

const { createWorld, createRobot } = require('./modules/martianRobots');
const { World, Robot, processInstructions: processInstructions2 } = require('./modules/martianRobots2');
const { validateWorldConfig, validateRobotConfig, validateInstructions } = require('./modules/validation');
const orientationOptions = require('./modules/orientationOptions');

interactiveScript(async (say, ask) => {
    const world = await readWorldConfig(say, ask);

    // functional approach constructor
    const processInstructions = createWorld(world.x, world.y);
    // OOP approach constructor
    const mars = new World(world.x, world.y);

    async function spawnRobot() {
        const robotConfig = await readRobotConfig(say, ask, world);
        const instructions = await readInstructions(say, ask);

        // Functional approach
        const robot = createRobot(robotConfig.x, robotConfig.y, robotConfig.orientation);

        try {
            const result = processInstructions(robot, instructions);

            say(`${chalk.green('Final position:')} ${result.robot.x} ${result.robot.y} ${result.robot.orientation} ${result.isRobotLost ? chalk.red('LOST') : ''}`);
        } catch (e) {
            reportError(say, e.message);
        }

        // OOP approach - comment out the functional one and uncomment following lines
        // const robot = new Robot(robotConfig.x, robotConfig.y, robotConfig.orientation);
        //
        // try {
        //     const isLost = processInstructions2(mars, robot, instructions);
        //
        //     say(`${chalk.green('Final position:')} ${robot.x} ${robot.y} ${robot.orientation} ${isLost ? chalk.red('LOST') : ''}`);
        // } catch (e) {
        //     reportError(say, e);
        // }

        await spawnRobot();
    }

    await spawnRobot();
});

async function readWorldConfig(say, ask) {
    const coordinates = await ask(chalk.yellow('What are the world\'s coordinates? '));
    let [worldX, worldY] = coordinates.split(' ');
    worldX = parseInt(worldX);
    worldY = parseInt(worldY);

    try {
        validateWorldConfig(worldX, worldY);
    } catch(e) {
        reportError(say, e.message);
    }

    return {
        x: worldX,
        y: worldY,
    };
}

async function readRobotConfig(say, ask, world) {
    const position = await ask(chalk.yellow(`What is the robot's position (X-coord, Y-coord, orientation (${orientationOptions.join('/')}))? `));
    let [robotX, robotY, robotOrientation] = position.split(' ');
    robotX = parseInt(robotX);
    robotY = parseInt(robotY);

    try {
        validateRobotConfig(robotX, robotY, robotOrientation, world);
    } catch(e) {
        reportError(say, e.message);
    }

    return {
        x: robotX,
        y: robotY,
        orientation: robotOrientation.toUpperCase(),
    };
}

async function readInstructions(say, ask) {
    const instructions = await ask(chalk.yellow('Please enter the instructions: '));

    try {
        validateInstructions(instructions);
    } catch(e) {
        reportError(say, e.message);
    }

    return instructions;
}

function reportError(say, message) {
    say(chalk.red(`${message}, quitting.`));
    throw new Error(message);
}
