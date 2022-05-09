import Game from "./Wolfie2D/Loop/Game";
import SplashScreen from "./Project/Scenes/SplashScreen";

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
            {name: "jump1", keys: ["w"]},
            {name: "attack1", keys: ["f"]},
            {name: "grab1", keys: ["g"]},
            {name: "block1", keys: ["h"]},
            {name: "skill11", keys: ["r"]},
            {name: "skill21", keys: ["t"]},
            {name: "skill31", keys: ["y"]},

            {name: "left2", keys: ["j"]},
            {name: "right2", keys: ["l"]},
            {name: "jump2", keys: ["i"]},
            {name: "attack2", keys: [";"]},
            {name: "grab2", keys: ["'"]},
            {name: "block2", keys: ["enter"]},
            {name: "skill12", keys: ["p"]},
            {name: "skill22", keys: ["["]},
            {name: "skill32", keys: ["]"]},

            {name: "escape", keys: ["escape"]},

            //cheats
            {name: "cheap_invincible", keys: ["b"]},
            {name: "unlock_all_lvls", keys: ["m"]},
            {name: "instant_win", keys: ["n"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();

function runTests(){};