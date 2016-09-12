const assert = require('assert');
const { createWorld, createRobot, turnLeft, turnRight, goForward } = require('./martianRobots');

describe('Robots on Mars', () => {
    it('should turn the robot to the left', () => {
        const robot1 = createRobot(1, 1, 'E');
        const robot2 = createRobot(3, 2, 'N');

        assert.equal(turnLeft(robot1).orientation, 'N');
        assert.equal(turnLeft(robot2).orientation, 'W');
    });

    it('should turn the robot to the right', () => {
        const robot1 = createRobot(1, 1, 'E');
        const robot2 = createRobot(3, 2, 'N');

        assert.equal(turnRight(robot1).orientation, 'S');
        assert.equal(turnRight(robot2).orientation, 'E');
    });

    it('should move the robot forward', () => {
        const robot1 = createRobot(1, 1, 'E');
        const robot2 = createRobot(3, 2, 'N');

        assert.equal(goForward(robot1).x, 2);
        assert.equal(goForward(robot1).y, 1);
        assert.equal(goForward(robot2).x, 3);
        assert.equal(goForward(robot2).y, 3);
    });

    it('should move the robot off the world', () => {
        const processInstructions = createWorld(2, 2);
        const robot1 = createRobot(1, 1, 'E');
        const result = processInstructions(robot1, 'FF');

        assert.equal(result.isRobotLost, true);
        assert.equal(result.robot.x, 2);
        assert.equal(result.robot.y, 1);
    });

    it('should prevent the robot from moving off the world', () => {
        const processInstructions = createWorld(2, 2);
        const robot1 = createRobot(1, 1, 'E');
        const result1 = processInstructions(robot1, 'FF'); //moves off from [2,1]

        assert.equal(result1.isRobotLost, true);

        const robot2 = createRobot(1, 1, 'E');
        const result2 = processInstructions(robot2, 'FF');

        assert.equal(result2.isRobotLost, false);
        assert.equal(result2.robot.x, 2);
        assert.equal(result2.robot.y, 1);
    });

    it('should detect the final position and orientation of the robot', () => {
        const processInstructions = createWorld(5, 3);
        const robot1 = createRobot(1, 1, 'E');
        const robot2 = createRobot(3, 2, 'N');
        const robot3 = createRobot(0, 3, 'W');
        const result1 = processInstructions(robot1, 'RFRFRFRF');
        const result2 = processInstructions(robot2, 'FRRFLLFFRRFLL');
        const result3 = processInstructions(robot3, 'LLFFFLFLFL');

        assert.equal(result1.isRobotLost, false);
        assert.equal(result1.robot.x, 1);
        assert.equal(result1.robot.y, 1);
        assert.equal(result1.robot.orientation, 'E');

        assert.equal(result2.isRobotLost, true);
        assert.equal(result2.robot.x, 3);
        assert.equal(result2.robot.y, 3);
        assert.equal(result2.robot.orientation, 'N');

        assert.equal(result3.isRobotLost, false);
        assert.equal(result3.robot.x, 2);
        assert.equal(result3.robot.y, 3);
        assert.equal(result3.robot.orientation, 'S');
    });

    it('should throw on invalid instruction', () => {
        const processInstructions = createWorld(5, 3);
        const robot1 = createRobot(1, 1, 'E');

        assert.throws(() => {
            processInstructions(robot1, '2');
        }, /invalid instruction/i);
    });
});
