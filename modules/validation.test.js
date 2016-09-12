const assert = require('assert');
const { validateWorldConfig, validateRobotConfig, validateInstructions } = require('./validation');

describe('Input validations', () => {
    it('should validate world config input', () => {
        assert.doesNotThrow(() => { validateWorldConfig(5, 5); });

        assert.throws(() => { validateWorldConfig(5.5, 0); });
        assert.throws(() => { validateWorldConfig(5, undefined); });
        assert.throws(() => { validateWorldConfig(-1, -5); });
        assert.throws(() => { validateWorldConfig(55, 5); });
    });

    it('should validate robot config input', () => {
        const world = {
            x: 5,
            y: 5,
        };

        assert.doesNotThrow(() => { validateRobotConfig(5, 5, 'N', world); });

        assert.throws(() => { validateRobotConfig(5.5, 0, 'N', world); }, /integer/);
        assert.throws(() => { validateRobotConfig(6, 5, 'N', world); }, /outside/);
        assert.throws(() => { validateRobotConfig(5, 5, undefined, world); }, /orientation/);
        assert.throws(() => { validateRobotConfig(5, 5, 'L', world); }, /orientation/);
    });

    it('should validate instructions input', () => {
        let longInstruction = '';
        for (let i=0; i < 100; i++) {
            longInstruction += 'R';
        }

        assert.doesNotThrow(() => { validateInstructions(longInstruction); });

        assert.throws(() => { validateInstructions(longInstruction + 'R'); }, /maximum/i);
    });
});
