## Martian Robots

### About the solution

Because of the nature of the problem, I've decided to go for a CLI-based solution, using [interactive-script](https://github.com/leebyron/interactive-script) library to interactively read the world's and robots' configuration, and robots' instructions. It is all powered by [async-to-gen](https://github.com/leebyron/async-to-gen) library which adds support for async functions in Node.js.

I started off writing the solution using an OOP approach for the core module (located in `modules/martialRobots2.js`) but when I got to integrating the module in `index.js` file, the usage didn't feel right - mainly because of the mutations of the `Robot` object - and, implicit result values.

That was the time I decided to rewrite the module using a functional approach. I made this new functional module (`modules/martialRobots.js`) a default one (*i.e. tests cover only this core module*), but decided to keep the OOP approach module in as it was already done (*and I think it was perfectly fine, I just prefer the functional approach*). You can find the OOP module integration in the `index.js` file commented out (*and by uncommenting it and commenting out the functional integration part, you can swap them any time with the application running the same way*).

### How to run
***Note:*** *Node version >=6.0.0 is required.*

    npm install
    npm start

### Tests
Test files are included in the `modules` directory. Currently, input validation functions and core robot movement and grid functions are being tested.

Tests can by ran by running

    npm test

