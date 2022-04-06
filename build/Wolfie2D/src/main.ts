import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./Project/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 34, g: 32, b: 52},   // The color the game clears to
        inputs: [
            {name: "left1", keys: ["a"]},
            {name: "right1", keys: ["d"]},
            {name: "jump1", keys: ["s"]},
            {name: "attack1", keys: ["j"]},
            {name: "grab1", keys: ["k"]},
            {name: "block1", keys: ["l"]},
            {name: "skill11", keys: ["u"]},
            {name: "skill21", keys: ["i"]},
            {name: "skill31", keys: ["p"]},

            {name: "left2", keys: ["arrowleft"]},
            {name: "right2", keys: ["arrowright"]},
            {name: "jump2", keys: ["arrowup"]},
            {name: "attack2", keys: ["1"]},
            {name: "grab2", keys: ["2"]},
            {name: "block2", keys: ["3"]},
            {name: "skill12", keys: ["4"]},
            {name: "skill22", keys: ["5"]},
            {name: "skill32", keys: ["6"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){};