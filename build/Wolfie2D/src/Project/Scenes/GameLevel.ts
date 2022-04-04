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
import EnemyController, { EnemyStates } from "../Enemies/EnemyController";
import { Project_Color } from "../project_color";
import { Project_Events } from "../project_enums";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import Project_ParticleSystem from "../project_ParticleSystem";

export default class GameLevel extends Scene {
    //player 1
    protected player1Spawn: Vec2;
    protected player1: AnimatedSprite;
    protected static hp1: number = 3;
    //UI
    protected hp1label: Label;
    protected round1label: Label;
    protected combo1label: Label;
    //player 2
    protected player2Spawn: Vec2;
    protected player2: AnimatedSprite;
    protected static hp2: number = 3;
    //UI
    protected hp2label: Label;
    protected round2label: Label;
    protected combo2label: Label;
    //round timer and round count
    protected rounds: number = 3;
    protected roundTimer: Timer;
    protected timerLabel: Label;
    protected roundOverLabel: Label;
    protected gameOverLabel: Label;

    // Stuff to end the level and go to the next level
    protected nextLevel: new (...args: any) => GameLevel;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Custom particle sysyem
    protected system: Project_ParticleSystem;

    startScene(): void {
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the round timer of 90 seconds
        this.roundTimer = new Timer(90000, () => {
            //TODO: Round over, call round over
            this.levelTransitionScreen.tweens.play("fadeIn");
        });
        this.levelTransitionTimer = new Timer(500);

        // Start the black screen fade out to the current screen
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();
    }


    updateScene(deltaT: number) {
        // Handle events and update the UI if needed
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case Project_Events.LEVEL_START:
                    // Re-enable controls
                    Input.enableInput();
                    break;
                case Project_Events.LEVEL_END:
                    // On level end, go back to main menu
                    this.sceneManager.changeToScene(MainMenu, {});
                    break;
                case Project_Events.PLAYER_KILLED:
                    this.respawnPlayer();
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
            Project_Events.PLAYER_KILLED
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI() {
        // In-game labels
        this.hp1label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(500, 30), text: "Lives: " + GameLevel.hp1 });
        this.hp1label.textColor = Color.BLACK;
        this.hp1label.font = "PixelSimple";

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
            ],
            onEnd: Project_Events.LEVEL_START
        });
    }

    /**
     * Initializes the player TODO: change start positions
     */
    protected initPlayer(): void {
        // Add the player 1
        this.player1 = this.add.animatedSprite("player", "primary");
        this.player1.scale.set(2, 2);
        if (!this.player1Spawn) {
            console.warn("Player 1 spawn was never set - setting spawn to (0, 0)");
            this.player1Spawn = Vec2.ZERO;
        }
        this.player1.position.copy(this.player1Spawn);
        this.player1.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player1.colliderOffset.set(0, 2);
        this.player1.addAI(PlayerController, { playerType: "platformer", tilemap: "Main", color: Project_Color.RED });
        this.player1.setGroup("player");
        // Add the player 2
        this.player2 = this.add.animatedSprite("player", "primary");
        this.player2.scale.set(2, 2);
        if (!this.player2Spawn) {
            console.warn("Player 2 spawn was never set - setting spawn to (0, 0)");
            this.player2Spawn = Vec2.ZERO;
        }
        this.player2.position.copy(this.player1Spawn);
        this.player2.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player2.colliderOffset.set(0, 2);
        this.player2.addAI(PlayerController, { playerType: "platformer", tilemap: "Main", color: Project_Color.RED });
        this.player2.setGroup("player");
    }

    /**
     * Adds an enemy into the game
     * @param spriteKey The key of the enemy sprite
     * @param tilePos The tilemap position to add the balloon to
     * @param aiOptions The options for the balloon AI
     */
    protected addAIEnemy(spriteKey: string, pos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position = pos.clone();
        enemy.scale.set(2, 2);
        enemy.addPhysics();
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("player");
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        //TODO:Change this
        GameLevel.hp1 += amt;
        this.hp1label.text = "Lives: " + GameLevel.hp1;
        if (GameLevel.hp1 == 0) {
            Input.disableInput();
            this.player1.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "player_death", loop: false, holdReference: false });
            this.player1.tweens.play("death");
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        GameLevel.hp1 = 3;
        GameLevel.hp2 = 3;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
        this.sceneManager.changeToScene(MainMenu, {});
        Input.enableInput();
        this.system.stopSystem();
    }
}