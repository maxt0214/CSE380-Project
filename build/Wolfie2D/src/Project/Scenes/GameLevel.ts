import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { Project_Color } from "../project_color";
import { Project_Events } from "../project_enums";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import Project_ParticleSystem from "../project_ParticleSystem";
import Layer from "../../Wolfie2D/Scene/Layer";

export default class GameLevel extends Scene {
    //player 1
    protected player1Spawn: Vec2;
    protected player1: AnimatedSprite;
    protected static hp1: number = 10;
    //UI
    protected hp1label: Label;
    protected round1label: Label;
    protected combo1label: Label;
    //player 2
    protected player2Spawn: Vec2;
    protected player2: AnimatedSprite;
    protected static hp2: number = 10;
    protected isAI: boolean;
    //UI
    protected hp2label: Label;
    protected round2label: Label;
    protected combo2label: Label;
    //round timer and round count
    protected rounds: number = 3;
    protected roundTimer: number;
    protected countdownTimer : number;

    protected timerLabel: Label;
    protected roundOverLabel: Label;
    protected gameOverLabel: Label;

    // pause stuff
    protected gamePaused: boolean = false;
    protected pauseUI: Layer;


    // Stuff to end the level and go to the next level
    protected nextLevel: new (...args: any) => GameLevel;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Custom particle sysyem
    protected system: Project_ParticleSystem;

    protected initOptions: Record<string, any>;

    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }

    //Initialize player and map base on selection
    loadScene(): void {
        this.load.tilemap("level", this.initOptions.map);

        this.load.spritesheet("player1", this.initOptions.p1);
        this.load.spritesheet("player2", this.initOptions.p2);

        this.load.audio("level_music", "project_assets/music/levelmusic.mp3");

        this.load.object("skillset1",this.initOptions.p1Skillset);
        this.load.object("skillset2",this.initOptions.p2Skillset);

        this.isAI = this.initOptions.isP2AI;
    }

    startScene(): void {
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();
        
        // Initialize the round timer of 90 seconds
        this.countdownTimer = 3000;
        this.roundTimer = 90000;
        this.levelTransitionTimer = new Timer(500);
        // Start the black screen fade out to the current screen
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        //Input.disableInput();
    }

    updateScene(deltaT: number) {
        // Handle events and update the UI if needed
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case Project_Events.LEVEL_END:
                    // On level end, go back to main menu
                    this.sceneManager.changeToScene(MainMenu, {});
                    break;
                case Project_Events.PLAYER_KILLED:
                    this.roundOver();
                    break;
                case Project_Events.PLAYER_ATTACK:
                    let dmgInfo = event.data as Record<string,any>;
                    let p1 = this.player1._ai as PlayerController;
                    let p2 = this.player2._ai as PlayerController;
                    console.log(`Player[${dmgInfo.get("party")}] attacks center[${dmgInfo.get("center")}] Range[${dmgInfo.get("range")}]`);
                    if(dmgInfo.get("party") === Project_Color.RED) {
                        if(p2.inRange(dmgInfo.get("center"),dmgInfo.get("range"),dmgInfo.get("state")))
                            this.incPlayerLife(Project_Color.BLUE,dmgInfo.get("dmg"));
                    } else {
                        if(p1.inRange(dmgInfo.get("center"),dmgInfo.get("range"),dmgInfo.get("state")))
                            this.incPlayerLife(Project_Color.RED,dmgInfo.get("dmg"));
                    }
                    break;
                case Project_Events.FIRE_PROJECTILE:
                    //TODO: Fire a project tile
                    
                    break;
            }
        }
        //handle timers
        if(this.countdownTimer <= 0) {
            if(this.roundTimer <= 0) {
                this.roundOver();
            }
            this.roundTimer -= deltaT;
        }
        this.countdownTimer -= deltaT;
        if(Input.isJustPressed("escape")){
            if(this.gamePaused){
                this.gamePaused = false;
                Input.enableInput();
            }
            else{
                this.gamePaused = true;
                Input.disableInput();
            }
        }
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");
        // Add a layer for players and enemies
        this.addLayer("primary", 1);
        this.pauseUI = this.addUILayer("pauseUI");
        this.pauseUI.disable;
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents() {
        this.receiver.subscribe([
            Project_Events.LEVEL_START,
            Project_Events.LEVEL_END,
            Project_Events.PLAYER_KILLED,
            Project_Events.PLAYER_ATTACK
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     * TODO: Change UI layout
     */
    protected addUI() {
        // In-game labels
        this.hp1label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(500, 30), text: "Lives: " + GameLevel.hp1 });
        this.hp1label.textColor = Color.BLACK;
        this.hp1label.font = "PixelSimple";
        
        this.hp2label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(100, 30), text: "Lives: " + GameLevel.hp2 });
        this.hp2label.textColor = Color.BLACK;
        this.hp2label.font = "PixelSimple";

        // round over label (start off screen)
        this.roundOverLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(-300, 200), text: "Round Over!" });
        this.roundOverLabel.size.set(1200, 60);
        this.roundOverLabel.borderRadius = 0;
        this.roundOverLabel.backgroundColor = new Color(34, 32, 52);
        this.roundOverLabel.textColor = Color.WHITE;
        this.roundOverLabel.fontSize = 48;
        this.roundOverLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.roundOverLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        // Create our particle system and initialize the pool
        this.system = new Project_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");

        //level transition. Black screen inbetween levels
        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;
        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Project_Events.LEVEL_END
        });
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player 1
        this.player1 = this.add.animatedSprite("player1", "primary");
        this.player1.scale.set(2, 2);
        if (!this.player1Spawn) {
            console.warn("Player 1 spawn was never set - setting spawn to (0, 0)");
            this.player1Spawn = Vec2.ZERO;
        }
        this.player1.position.copy(this.player1Spawn);
        this.player1.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player1.colliderOffset.set(0, 2);
        this.player1.addAI(PlayerController, { 
            playerType: "platformer", 
            tilemap: "Main", 
            color: Project_Color.RED, 
            skills:this.load.getObject("skillset1") 
        });
        this.player1.setGroup("player");
        this.viewport.follow(this.player1);
        // Add the player 2
        this.player2 = this.add.animatedSprite("player2", "primary");
        this.player2.scale.set(2, 2);
        if (!this.player2Spawn) {
            console.warn("Player 2 spawn was never set - setting spawn to (0, 0)");
            this.player2Spawn = Vec2.ZERO;
        }
        this.player2.position.copy(this.player2Spawn);
        this.player2.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player2.colliderOffset.set(0, 2);
        this.player2.addAI(PlayerController, { 
            playerType: this.isAI ? "AI" : "platformer", 
            tilemap: "Main", 
            color: Project_Color.BLUE,
            skills:this.load.getObject("skillset2")
        });
        this.player2.setGroup("player");
    }

    //TODO: Change UI
    protected incPlayerLife(party: string, dmg: number): void {
        console.log(`Player[${party}] is hit, losing ${dmg} hps`);
        if(party === Project_Color.RED) {
            GameLevel.hp1 += dmg;
        } else {
            GameLevel.hp2 += dmg;
        }

        this.hp1label.text = "Lives: " + GameLevel.hp1;
        if (GameLevel.hp1 == 0) {
            Input.disableInput();
            this.player1.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "player_death", loop: false, holdReference: false });
            this.player1.tweens.play("death");
        }

        this.hp2label.text = "Lives: " + GameLevel.hp2;
        if (GameLevel.hp2 == 0) {
            Input.disableInput();
            this.player2.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "player_death", loop: false, holdReference: false });
            this.player2.tweens.play("death");
        }
    }

    protected roundOver(): void {
        Input.disableInput();
        this.system.stopSystem();
        //all rounds over, back to main menu
        if(this.rounds <= 0) {
            this.sceneManager.changeToScene(MainMenu, {});

            return;
        }

        //TODO: show player wining UI
        if(GameLevel.hp1 <= 0) {
            
        } else if(GameLevel.hp2 <= 0) {

        } else {

        }

        //reset player stat
        GameLevel.hp1 = 10;
        GameLevel.hp2 = 10;
        this.player1.position = this.player1Spawn.clone();
        this.player2.position = this.player2Spawn.clone();
        this.rounds--;
        
        this.countdownTimer = 3000;
        this.roundTimer = 90000;
        
        this.levelTransitionScreen.tweens.play("fadeIn");
    }
}