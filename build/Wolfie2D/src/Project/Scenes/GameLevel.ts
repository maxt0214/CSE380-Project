import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
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
import HazardController from "../Hazards/HazardController";
import Project_ParticleSystem from "../project_ParticleSystem";
import Prop from "../Props/Prop";
import Map from "../../Wolfie2D/DataTypes/Map"
import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import HomeScreen from "./HomeScreen";
import StageSelect from "./StageSelect";

export default class GameLevel extends Scene {
    protected origin_center: Vec2;
    //player 1
    protected player1Spawn: Vec2;
    protected player1: AnimatedSprite;
    protected static hp1: number = 10;
    protected p1action: String;      // neutral, attacking, grabbing, or blocking
    protected p1rounds: number = 0;
    //hit timer stuff
    protected p1MoveHit: boolean = true;
    protected p1MoveTimer: number = 0;
    protected p1StartupTimer: number = 0;
    protected p1dmgInfo: Map<any>;
    //UI
    protected hp1label: Label;
    protected round1label: Label;
    protected combo1label: Label;
    //player 2
    protected player2Spawn: Vec2;
    protected player2: AnimatedSprite;
    protected static hp2: number = 10;
    protected p2action: String;      // neutral, attacking, grabbing, or blocking
    protected p2rounds: number = 0;
    protected isAI: boolean;
    //hit timer stuff
    protected p2MoveHit: boolean = true;
    protected p2MoveTimer: number = 0;
    protected p2StartupTimer: number = 0;
    protected p2dmgInfo: Map<any>;
    //props
    protected props: Array<AnimatedSprite> = new Array(50);
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
    protected size: Vec2;
    protected gamePaused: boolean = false;
    protected pauseUI: Layer;

    protected controlsUI: Layer;

    protected p1rock: any;
    protected p2rock: any;
    protected p1scis: any;
    protected p2scis: any;
    protected p1paper: any;
    protected p2paper: any;


    // Stuff to end the level and go to the next level
    protected nextLevel: new (...args: any) => GameLevel;
    protected nextLevelNum: number;

    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    // Custom particle sysyem
    protected system: Project_ParticleSystem;

    protected initOptions: Record<string, any>;

    protected hazardController: HazardController;

    // next level on level end vs AI stuff
    protected nextMap: String;
    protected nextEnemy: String;
    protected nextEnemySkillset: String;
    protected p1Lost: boolean = false;
    protected level_is_last: boolean = false;


    protected stageUnlocked: number;    // latest stage unlocked. starts at 1 and maxes at 6.

    initScene(init: Record<string, any>): void {
        this.origin_center = this.viewport.getCenter().clone();
        this.initOptions = init;
    }

    //Initialize player and map base on selection
    loadScene(): void {
        this.load.tilemap("level", this.initOptions.map);
        this.hazardController = new HazardController(this.initOptions.map);
        //load p1 and p2
        this.load.spritesheet("player1", this.initOptions.p1);
        this.load.spritesheet("player2", this.initOptions.p2);
        //load skills for p1 and p2
        this.load.object("skillset1",this.initOptions.p1Skillset);
        this.load.object("skillset2",this.initOptions.p2Skillset);
        //load props
        this.load.spritesheet("fireball_sp", "project_assets/spritesheets/projectile.json");
        this.load.spritesheet("bubble_sp", "project_assets/spritesheets/bubble.json");
        this.load.spritesheet("crystal_sp", "project_assets/spritesheets/crystal.json");
        this.load.spritesheet("coconut_sp", "project_assets/spritesheets/coconut.json");
        this.load.spritesheet("swirl_sp", "project_assets/spritesheets/swirl.json");
        this.load.spritesheet("car_sp", "project_assets/spritesheets/car.json");
        this.load.spritesheet("rock_sp", "project_assets/spritesheets/rock.json");
        this.load.spritesheet("lavadrop_sp", "project_assets/spritesheets/lavadrop.json");
        this.load.spritesheet("deadlylava_sp", "project_assets/spritesheets/deadlylava.json");
        
        this.load.object("fireball","project_assets/props/fireball.json");
        this.load.object("bubble","project_assets/props/bubble.json");
        this.load.object("crystal","project_assets/props/crystal.json");
        this.load.object("coconut","project_assets/props/coconut.json");
        this.load.object("swirl","project_assets/props/swirl.json");
        this.load.object("car","project_assets/props/car.json");
        this.load.object("rock","project_assets/props/rock.json");
        this.load.object("lavadrop","project_assets/props/lavadrop.json");
        this.load.object("deadlylava","project_assets/props/deadlylava.json");

        //load ui state imgs
        this.load.image("rockui","project_assets/ui/rock.png");
        this.load.image("paperui","project_assets/ui/paper.png");
        this.load.image("scisui","project_assets/ui/scissors.png");
        
        this.isAI = this.initOptions.isP2AI;
        this.stageUnlocked =this.initOptions.stageUnlocked;

        this.load.image("pausescreen", "project_assets/backgrounds/pausescreen.png");
        this.load.image("controls", "project_assets/backgrounds/Controlsnew.png");

        

    }

    startScene(): void {
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.initProps();
        this.subscribeToEvents();
        this.addUI();
        this.addPauseScreen();
        this.addControlsScreen();

        // Initialize the round timer of 90 seconds
        this.countdownTimer = 3000;
        this.roundTimer = 90000;
        this.levelTransitionTimer = new Timer(500);
        // Start the black screen fade out to the current screen
        this.levelTransitionScreen.tweens.play("fadeOut");
    }

    updateScene(deltaT: number) {
        this.handleProps();
        this.hazardController.update(deltaT);
        // Handle events and update the UI if needed
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case Project_Events.ROUND_END:
                    this.levelTransitionScreen.tweens.play("fadeOut");
                    Input.enableInput();
                    break;
                case Project_Events.LEVEL_END:
                    // On level end in pvp or if player lost in p v ai, go back to main menu
                    if(!this.isAI || this.p1Lost){
                        Input.enableInput();
                        this.viewport.follow(null);
                        this.viewport.setCenter(this.origin_center);
                        this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
                        break;
                    } else{ // on level end vs AI, go to the next level. 
                        if(this.nextLevelNum > this.stageUnlocked){
                            this.stageUnlocked = this.nextLevelNum;
                        }
                        let sceneOptions1 = {
                            physics: {
                                groupNames: ["ground", "player", "props"],
                                collisions:
                                [
                                    [0, 1, 0],
                                    [1, 0, 0],
                                    [0, 0, 0]
                                ]
                            }
                        }
                        this.sceneManager.changeToScene(this.nextLevel, { 
                            map: this.nextMap,
                            p1: this.initOptions.p1,    //keep same
                            p2: this.nextEnemy,
                            p1Skillset: this.initOptions.p1Skillset,    //keep same
                            p2Skillset: this.nextEnemySkillset, 
                            isP2AI: this.isAI,       //keep same
                            stageUnlocked: this.stageUnlocked
                        }, sceneOptions1);

                    }
                case Project_Events.PLAYER_KILLED:
                    this.roundOver();
                    break;
                case Project_Events.UPDATE_ACTION:
                    if(event.data.get("party") === Project_Color.RED){ //p1
                        if(event.data.get("type") === "s"){
                            this.p1action = "attacking";
                            this.p1rock.visible = false;
                            this.p1paper.visible = false;
                            this.p1scis.visible = true;
                        }
                        if(event.data.get("type") === "p"){
                            this.p1action = "grabbing";
                            this.p1rock.visible = false;
                            this.p1paper.visible = true;
                            this.p1scis.visible = false;   
                        } 
                        if(event.data.get("type") === "r"){
                            this.p1action = "blocking";
                            this.p1rock.visible = true;
                            this.p1paper.visible = false;
                            this.p1scis.visible = false;  
                        }
                        if(event.data.get("type") === "neutral"){
                            this.p1action = "neutral";
                            this.p1rock.visible = false;
                            this.p1paper.visible = false;
                            this.p1scis.visible = false;     
                        }
                        console.log(`Player[${event.data.get("party")} action is ${this.p1action}]`);
                    }
                    if(event.data.get("party") === Project_Color.BLUE){ //p2
                        if(event.data.get("type") === "s"){
                            this.p2action = "attacking";
                            this.p2rock.visible = false;
                            this.p2paper.visible = false;
                            this.p2scis.visible = true;
                        }
                        if(event.data.get("type") === "p"){
                            this.p2rock.visible = false;
                            this.p2paper.visible = true;
                            this.p2scis.visible = false;
                            this.p2action = "grabbing";    
                        }
                        if(event.data.get("type") === "r"){
                            this.p2rock.visible = true;
                            this.p2paper.visible = false;
                            this.p2scis.visible = false;
                            this.p2action = "blocking";
                        }
                        if(event.data.get("type") === "neutral"){
                            this.p2rock.visible = false;
                            this.p2paper.visible = false;
                            this.p2scis.visible = false;
                            this.p2action = "neutral";        
                        }
                        console.log(`Player[${event.data.get("party")} action is ${this.p2action}]`);
      
                    }
                    break;
                case Project_Events.PLAYER_ATTACK: // red = p1         blue = p2
                    let dmgInfo = event.data;
                    let p1 = this.player1._ai as PlayerController;
                    let p2 = this.player2._ai as PlayerController;
                    if(dmgInfo.get("party") === Project_Color.RED) {    //p1 attacking
                        // play p1 attack sounds
                        if(dmgInfo.get("name") === "ATTACK")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1attack", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "GRAB")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1grab", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "BLOCK")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1block", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL1")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1skill1", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL2")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1skill2", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL3")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1skill3", loop: false, holdReference: false});
                
                        this.p1dmgInfo = dmgInfo;
                        this.p1StartupTimer = dmgInfo.get("startup");
                        this.p1MoveTimer = dmgInfo.get("timer");
                        this.p1MoveHit = false;

                    } else {    //p2 attacking
                        // play p2 attack sounds
                        if(dmgInfo.get("name") === "ATTACK")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2attack", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "GRAB")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2grab", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "BLOCK")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2block", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL1")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2skill1", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL2")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2skill2", loop: false, holdReference: false});
                        if(dmgInfo.get("name") === "SKILL3")
                            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2skill3", loop: false, holdReference: false});

                        this.p2dmgInfo = dmgInfo;
                        this.p2StartupTimer = dmgInfo.get("startup");
                        this.p2MoveTimer = dmgInfo.get("timer");
                        this.p2MoveHit = false;
                    }
                    break;
                case Project_Events.FIRE_PROJECTILE:
                    if(event.data.get("party") === Project_Color.RED)
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1skill1", loop: false, holdReference: false});
                    else if(event.data.get("party") === Project_Color.BLUE)
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2skill1", loop: false, holdReference: false});
                    this.fireProjectile(event.data);
                    break;
            }
        }

        // P1
        // tick down move startup and move time timers
        if(!this.gamePaused){
            if(this.p1MoveTimer >= 0)
                this.p1MoveTimer -= deltaT;
            if(this.p1StartupTimer >= 0)
                this.p1StartupTimer -= deltaT;
        }
        
        if(this.p1MoveTimer >= 0 && this.p1StartupTimer <= 0 && !this.p1MoveHit){ 
            // the attack can only hit when the startup time is done, the move is still active, and the move has not hit yet.
            let p1 = this.player1._ai as PlayerController;
            let p2 = this.player2._ai as PlayerController;
            if(p2.inRange(this.p1dmgInfo.get("center"),this.p1dmgInfo.get("range"),this.p1dmgInfo.get("state"),this.p1dmgInfo.get("dir"))){ //if p2 is in range of attack, 
                this.p1MoveHit = true;
                if(this.p1dmgInfo.get("type") === "s" && !(this.p2action === "blocking")){ // p2 not blocking (p2 attacked)
                    this.incPlayerLife(Project_Color.BLUE,this.p1dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p2.changeState(this.p1dmgInfo.get("state"));
                }
                if(this.p1dmgInfo.get("type") === "s" && this.p2action === "blocking"){ // p2 blocking (p1 attacked)
                    this.incPlayerLife(Project_Color.RED,this.p1dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p1.changeState(this.p1dmgInfo.get("state"));
                }
                if(this.p1dmgInfo.get("type") === "p" && !(this.p2action === "attacking")){ // p1 grabs, p2 not attacking, p2 takes damage
                    this.incPlayerLife(Project_Color.BLUE,this.p1dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p2.changeState(this.p1dmgInfo.get("state"));
                }
                if(this.p1dmgInfo.get("type") === "r" && !(this.p1dmgInfo.get("name") === "BLOCK") && !(this.p2action === "grabbing")){ // p1 rock move that is not a block, p2 is not grabbing, p2 takes dmg
                    this.incPlayerLife(Project_Color.BLUE,this.p1dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p2.changeState(this.p1dmgInfo.get("state"));
            
                }
            }
        }
        // P2
        // tick down move startup and move time timers
        if(!this.gamePaused){
            if(this.p2MoveTimer >= 0)
                this.p2MoveTimer -= deltaT;
            if(this.p2StartupTimer >= 0)
                this.p2StartupTimer -= deltaT;
        }

        if(this.p2MoveTimer >= 0 && this.p2StartupTimer <= 0 && !this.p2MoveHit){ 
            // the attack can only hit when the startup time is done, the move is still active, and the move has not hit yet.
            let p1 = this.player1._ai as PlayerController;
            let p2 = this.player2._ai as PlayerController;
            if(p1.inRange(this.p2dmgInfo.get("center"),this.p2dmgInfo.get("range"),this.p2dmgInfo.get("state"),this.p2dmgInfo.get("dir"))){ //if p1 is in range of attack, 
                this.p2MoveHit = true;
                if(this.p2dmgInfo.get("type") === "s" && !(this.p1action === "blocking")){ // p1 not blocking (p1 attacked)
                    this.incPlayerLife(Project_Color.RED,this.p2dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p1.changeState(this.p2dmgInfo.get("state"));
                }
                if(this.p2dmgInfo.get("type") === "s" && this.p1action === "blocking"){ // p1 blocking (p2 attacked)
                    this.incPlayerLife(Project_Color.BLUE,this.p2dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p2.changeState(this.p2dmgInfo.get("state"));
                }
                if(this.p2dmgInfo.get("type") === "p" && !(this.p1action === "attacking")){ // p2 grabs, p1 not attacking, p1 takes damage
                    this.incPlayerLife(Project_Color.BLUE,this.p2dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p1.changeState(this.p2dmgInfo.get("state"));
            
                }
                if(this.p2dmgInfo.get("type") === "r" && !(this.p2dmgInfo.get("name") === "BLOCK") && !(this.p1action === "grabbing")){ // p2 rock move that is not a block, p1 is not grabbing, p1 takes dmg
                    this.incPlayerLife(Project_Color.BLUE,this.p2dmgInfo.get("dmg"));
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hit", loop: false, holdReference: false});
                    p1.changeState(this.p1dmgInfo.get("state"));
                }
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

        if(Input.isJustPressed("instant_win") && !this.gamePaused){ // instant win cheat if game is not paused
            this.incPlayerLife(Project_Color.BLUE, -100);
        }

        if(Input.isJustPressed("escape")){          // issues : you can wait out invincibility timer in pause : button click does not work (rn you mouse over it).
            this.gamePaused = !this.gamePaused;
            if(this.gamePaused){    // pause game
                this.player1.freeze();
                this.player2.freeze();
                this.pauseUI.enable();
                this.controlsUI.disable();
                for(let i = 0; i < 50; i++) {
                    this.props[i].freeze();
                }
            } else{             //unpause game
                this.player1.unfreeze();
                this.player2.unfreeze();
                this.pauseUI.disable();
                this.controlsUI.disable();
                for(let i = 0; i < 50; i++) {
                    this.props[i].unfreeze();
                }
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
        this.pauseUI.setDepth(2);
        this.pauseUI.disable();

        this.controlsUI = this.addUILayer("controlsUI");
        this.controlsUI.setDepth(3);
        this.controlsUI.disable();
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.size = this.viewport.getHalfSize();
        this.viewport.setZoomLevel(2.5);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents() {
        this.receiver.subscribe([
            Project_Events.LEVEL_START,
            Project_Events.LEVEL_END,
            Project_Events.PLAYER_KILLED,
            Project_Events.PLAYER_ATTACK,
            Project_Events.FIRE_PROJECTILE,
            Project_Events.ROUND_END,
            Project_Events.UPDATE_ACTION
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     * TODO: Change UI layout
     */
    protected addUI() {
        // In-game labels
        this.hp1label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(50, 30), text: "Health: " + GameLevel.hp1 });
        this.hp1label.textColor = Color.WHITE;
        this.hp1label.font = "PixelSimple";
        
        this.hp2label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(430, 30), text: "Health: " + GameLevel.hp2 });
        this.hp2label.textColor = Color.WHITE;
        this.hp2label.font = "PixelSimple";

        this.round1label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(50, 60), text: "Rounds: " + this.p1rounds });
        this.round1label.textColor = Color.WHITE;
        this.round1label.font = "PixelSimple";
        
        this.round2label = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(430, 60), text: "Rounds: " + this.p2rounds });
        this.round2label.textColor = Color.WHITE;
        this.round2label.font = "PixelSimple";

        // round over label (start off screen)
        this.roundOverLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", { position: new Vec2(-300, 200), text: "Round Over!" });
        this.roundOverLabel.size.set(1200, 60);
        this.roundOverLabel.borderRadius = 0;
        this.roundOverLabel.backgroundColor = new Color(34, 32, 52);
        this.roundOverLabel.textColor = Color.WHITE;
        this.roundOverLabel.fontSize = 48;
        this.roundOverLabel.font = "PixelSimple";

        // player states represented with images

        this.p1rock = this.add.sprite("rockui", "UI");
        this.p1rock.scale.set(1.00, 1.00);
        this.p1rock.position.copy(this.size);
        this.p1rock.position.add(new Vec2(-150, -120));
        this.p1rock.visible = false;
        
        this.p2rock = this.add.sprite("rockui", "UI");
        this.p2rock.scale.set(1.00, 1.00);
        this.p2rock.position.copy(this.size);
        this.p2rock.position.add(new Vec2(150, -120))
        this.p2rock.visible = false;

        this.p1scis = this.add.sprite("scisui", "UI");
        this.p1scis.scale.set(1.00, 1.00);
        this.p1scis.position.copy(this.size);
        this.p1scis.position.add(new Vec2(-150, -120));
        this.p1scis.visible = false;
        
        this.p2scis = this.add.sprite("scisui", "UI");
        this.p2scis.scale.set(1.00, 1.00);
        this.p2scis.position.copy(this.size);
        this.p2scis.position.add(new Vec2(150, -120));
        this.p2scis.visible = false;

        this.p1paper = this.add.sprite("paperui", "UI");
        this.p1paper.scale.set(1.00, 1.00);
        this.p1paper.position.copy(this.size);
        this.p1paper.position.add(new Vec2(-150, -120));
        this.p1paper.visible = false;
        
        this.p2paper = this.add.sprite("paperui", "UI");
        this.p2paper.scale.set(1.00, 1.00);
        this.p2paper.position.copy(this.size);
        this.p2paper.position.add(new Vec2(150, -120));
        this.p2paper.visible = false;

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
            onEnd: Project_Events.ROUND_END
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


    protected addPauseScreen(){
        let bg = this.add.sprite("pausescreen", "pauseUI");
        bg.scale.set(0.4, 0.4);
        bg.position.copy(this.size);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseUI", {position: new Vec2(this.size.x, this.size.y +100), text: "Back to Menu"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(40, 15));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onEnter = () => {
            //console.log('BBBBBBBBBBBBBBBBB')
            if(Input.isMouseJustPressed()){
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAA')
                this.viewport.follow(null);
                this.viewport.setCenter(this.origin_center);
                this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
            }
        }

        let ctrlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "pauseUI", {position: new Vec2(this.size.x, this.size.y), text: "Controls"});
        ctrlsBtn.backgroundColor = Color.TRANSPARENT;
        ctrlsBtn.borderColor = Color.WHITE;
        ctrlsBtn.borderRadius = 0;
        ctrlsBtn.setPadding(new Vec2(40, 15));
        ctrlsBtn.font = "PixelSimple";

        // When the ctrls button is clicked, go to the next scene
        ctrlsBtn.onEnter = () => {
            if(Input.isMouseJustPressed()){
                this.controlsUI.enable();
                this.pauseUI.disable();
            }
        }
    }

    protected addControlsScreen(){
        let bg = this.add.sprite("controls", "controlsUI");
        bg.scale.set(0.4, 0.4);
        bg.position.copy(this.size);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "controlsUI", {position: new Vec2(this.size.x, this.size.y +150), text: "Back"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.TRANSPARENT;
        backBtn.textColor = Color.TRANSPARENT;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(40, 15));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onEnter = () => {
            //console.log('BBBBBBBBBBBBBBBBB')
            if(Input.isMouseJustPressed()){
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAA')
                this.controlsUI.disable();
                this.pauseUI.enable();
            }
        }
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
        GameLevel.hp1 = 10;
        this.player1.addPhysics(new AABB(Vec2.ZERO, new Vec2(28, 28)));
        this.player1.colliderOffset.set(0, 2);
        this.player1.addAI(PlayerController, { 
            playerType: "platformer", 
            tilemap: "Main", 
            color: Project_Color.RED, 
            skills:this.load.getObject("skillset1") 
        });
        this.player1.setGroup("player");
        this.p1action = "neutral";
        this.viewport.follow(this.player1);
        // Add the player 2
        this.player2 = this.add.animatedSprite("player2", "primary");
        this.player2.scale.set(2, 2);
        this.player2.invertX = true;
        if (!this.player2Spawn) {
            console.warn("Player 2 spawn was never set - setting spawn to (0, 0)");
            this.player2Spawn = Vec2.ZERO;
        }
        this.player2.position.copy(this.player2Spawn);
        GameLevel.hp2 = 10;
        this.player2.addPhysics(new AABB(Vec2.ZERO, new Vec2(28, 28)));
        this.player2.colliderOffset.set(0, 2);
        this.player2.addAI(PlayerController, { 
            playerType: this.isAI ? "AI" : "platformer", 
            player: this.player1,
            tilemap: "Main", 
            color: Project_Color.BLUE,
            skills:this.load.getObject("skillset2")
        });
        this.player2.setGroup("player");
        this.p2action = "neutral";
    }

    //TODO: Change UI
    protected incPlayerLife(party: string, dmg: number): void {
        console.log(`Player[${party}] is hit, losing ${dmg} hps`);
        if(party === Project_Color.RED) {
            GameLevel.hp1 += dmg;
            this.p1action = "neutral";
            this.p1rock.visible = false;
            this.p1paper.visible = false;
            this.p1scis.visible = false;     
        } else {
            this.p2action = "neutral";
            this.p2rock.visible = false;
            this.p2paper.visible = false;
            this.p2scis.visible = false;   
            GameLevel.hp2 += dmg;
        }

        this.hp1label.text = "Lives: " + GameLevel.hp1;
        if (GameLevel.hp1 <= 0) {
            this.p2rounds +=1;
            this.round2label.text = "Rounds: " + this.p2rounds;
            //Input.disableInput();
            this.player1.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "p1player_death", loop: false, holdReference: false });
            this.player1.tweens.play("death");
            for(let i = 0; i < 50; i++) {
                this.props[i].visible = false;
            }
        }

        this.hp2label.text = "Lives: " + GameLevel.hp2;
        if (GameLevel.hp2 <= 0) {
            //Input.disableInput();
            this.p1rounds +=1;
            this.round1label.text = "Rounds: " + this.p1rounds;
            this.player2.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "p2player_death", loop: false, holdReference: false });
            this.player2.tweens.play("death");
            for(let i = 0; i < 50; i++) {
                this.props[i].visible = false;
            }
        }
    }

    protected roundOver(): void {
        this.system.stopSystem();
        //all rounds over, back to main menu
        if(this.p1rounds >= 2) {
            this.p1Lost = false;
            this.emitter.fireEvent(Project_Events.LEVEL_END);
            return;
        }
        if(this.p2rounds >= 2) {
            this.p1Lost = true;
            this.emitter.fireEvent(Project_Events.LEVEL_END);
            return;
        }

        //reset player stat
        GameLevel.hp1 = 10;
        GameLevel.hp2 = 10;
        this.hp1label.text = "Lives: " + GameLevel.hp1;
        this.hp2label.text = "Lives: " + GameLevel.hp2;
        this.player1.position = this.player1Spawn.clone();
        this.player2.position = this.player2Spawn.clone();
        this.player1.alpha = 1;
        this.player2.alpha = 1;
        this.player1.enablePhysics();
        this.player2.enablePhysics();
        this.rounds--;
        
        this.countdownTimer = 3000;
        this.roundTimer = 90000;
        
        this.levelTransitionScreen.tweens.play("fadeIn");
    }

    //handl collision between props and players
    protected handleProps() {
        let viewPort = this.viewport.getCenter().clone();

        let p1 = this.player1._ai as PlayerController;
        let p2 = this.player2._ai as PlayerController;

        for(let prop of this.props) {
            if(!prop.visible) continue;

            let propAI = prop.ai as Prop;
            console.log('proj type:' + propAI.type)

            if(this.player1.collisionShape.overlaps(prop.collisionShape) && p1.party != propAI.party && propAI.type === "s") { // s hits p1 when not blocking
                if(!(this.p1action === "blocking")){
                    if(p1.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p1.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }
            if(this.player1.collisionShape.overlaps(prop.collisionShape) && p1.party != propAI.party && propAI.type === "r") { // r hits p1 when not grabbing
                if(!(this.p1action === "grabbing")){
                    if(p1.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p1.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }
            if(this.player1.collisionShape.overlaps(prop.collisionShape) && p1.party != propAI.party && propAI.type === "p") { // p hits p1 when not attking
                if(!(this.p1action === "attacking")){
                    if(p1.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p1.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }

            if(this.player2.collisionShape.overlaps(prop.collisionShape) && p2.party != propAI.party  && propAI.type === "s") {
                if(!(this.p2action === "blocking")){
                    if(p2.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p2.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }
            if(this.player2.collisionShape.overlaps(prop.collisionShape) && p2.party != propAI.party && propAI.type === "r") {
                if(!(this.p2action === "grabbing")){
                    if(p2.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p2.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }
            if(this.player2.collisionShape.overlaps(prop.collisionShape) && p2.party != propAI.party && propAI.type === "p") {
                if(!(this.p2action === "attacking")){
                    if(p2.hitWithProp(propAI.buff,propAI.dir.x)) {
                        this.incPlayerLife(p2.party,propAI.dmg);
                    }
                }
                prop.visible = false;
            }

            this.handleScreenDespawn(prop,viewPort);
        }
    }

    protected initProps() {
        let data = new Map<any>();
        data.add("party", "Red");
        data.add("center", new Vec2(0,0));
        data.add("dir", new Vec2(0,0));
        data.add("projectile", "fireball");
        for(let i = 0; i < 50; i++) {
            this.respawnProp(i, data, false);
        }
    }

    protected fireProjectile(options:Record<string, any>) {
        for(let i = 0; i < 50; i++) {
            if(!this.props[i].visible) {
                this.props[i].destroy();
                this.respawnProp(i, options, true);
                break;
            }
        }
    }

    protected respawnProp(i: number, options: Record<string,any>, visible: boolean) {
        this.props[i] = this.add.animatedSprite(options.get("projectile")+"_sp","primary");

        let prop = this.props[i];
        prop.scale.set(2, 2);
        prop.position.copy(options.get("center"));

        prop.addAI(Prop, {
            name: options.get("projectile"),
            party: options.get("party"),
            dir: options.get("dir"),
            propInfo: this.load.getObject(options.get("projectile")).def
        });
        prop.setGroup("props");
        prop.visible = visible;
    }
    
    protected handleScreenDespawn(node: AnimatedSprite, viewportCenter: Vec2): void {
		if(node.position.y > viewportCenter.y + 640 || node.position.y < viewportCenter.y - 320 || node.position.x > viewportCenter.x + 480 || node.position.x < viewportCenter.x - 480) {
            console.log(`Prop Despawned at ${JSON.stringify(node.position)}`);
            node.position = new Vec2(0,0);
            node.visible = false;
            node.isCollidable = false;
		}
	}
    //Load p1 sfx
    loadp1Sound(name: string) {
        if(name.includes("fighter")) {
            this.load.audio("p1jump", "project_assets/sounds/fighter/jump.wav");
            this.load.audio("p1player_death", "project_assets/sounds/fighter/player_death.wav");
            this.load.audio("p1attack", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p1grab", "project_assets/sounds/fighter/grab.wav");
            this.load.audio("p1block", "project_assets/sounds/fighter/block.wav");
            this.load.audio("p1skill1", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p1skill2", "project_assets/sounds/fighter/skill2.wav");
            this.load.audio("p1skill3", "project_assets/sounds/fighter/skill3.wav");
        } else if(name.includes("waterlady")) {
            this.load.audio("p1jump", "project_assets/sounds/waterlady/jump.wav");
            this.load.audio("p1player_death", "project_assets/sounds/waterlady/player_death.wav");
            this.load.audio("p1attack", "project_assets/sounds/waterlady/attack.wav");
            this.load.audio("p1grab", "project_assets/sounds/waterlady/grab.wav");
            this.load.audio("p1block", "project_assets/sounds/waterlady/block.wav");
            this.load.audio("p1skill1", "project_assets/sounds/waterlady/skill1.wav");
            this.load.audio("p1skill2", "project_assets/sounds/waterlady/skill2.wav");
            this.load.audio("p1skill3", "project_assets/sounds/waterlady/skill3.wav");
        } else {
            this.load.audio("p1jump", "project_assets/sounds/dwarf/jump.wav");
            this.load.audio("p1player_death", "project_assets/sounds/dwarf/player_death.wav");
            this.load.audio("p1attack", "project_assets/sounds/dwarf/attack.wav");
            this.load.audio("p1grab", "project_assets/sounds/dwarf/grab.wav");
            this.load.audio("p1block", "project_assets/sounds/dwarf/block.wav");
            this.load.audio("p1skill1", "project_assets/sounds/dwarf/skill1.wav");
            this.load.audio("p1skill2", "project_assets/sounds/dwarf/skill2.wav");
            this.load.audio("p1skill3", "project_assets/sounds/dwarf/skill3.wav");
        }
    }
    //Load p2 sfx
    loadp2Sound(name: string) {
        if(name.includes("fighter")) {
            this.load.audio("p2jump", "project_assets/sounds/fighter/jump.wav");
            this.load.audio("p2player_death", "project_assets/sounds/fighter/player_death.wav");
            this.load.audio("p2attack", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p2grab", "project_assets/sounds/fighter/grab.wav");
            this.load.audio("p2block", "project_assets/sounds/fighter/block.wav");
            this.load.audio("p2skill1", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p2skill2", "project_assets/sounds/fighter/skill2.wav");
            this.load.audio("p2skill3", "project_assets/sounds/fighter/skill3.wav");
        } else if(name.includes("waterlady")) {
            this.load.audio("p2jump", "project_assets/sounds/waterlady/jump.wav");
            this.load.audio("p2player_death", "project_assets/sounds/waterlady/player_death.wav");
            this.load.audio("p2attack", "project_assets/sounds/waterlady/attack.wav");
            this.load.audio("p2grab", "project_assets/sounds/waterlady/grab.wav");
            this.load.audio("p2block", "project_assets/sounds/waterlady/block.wav");
            this.load.audio("p2skill1", "project_assets/sounds/waterlady/skill1.wav");
            this.load.audio("p2skill2", "project_assets/sounds/waterlady/skill2.wav");
            this.load.audio("p2skill3", "project_assets/sounds/waterlady/skill3.wav");
        } else { //dwarf
            this.load.audio("p2jump", "project_assets/sounds/dwarf/jump.wav");
            this.load.audio("p2player_death", "project_assets/sounds/dwarf/player_death.wav");
            this.load.audio("p2attack", "project_assets/sounds/dwarf/attack.wav");
            this.load.audio("p2grab", "project_assets/sounds/dwarf/grab.wav");
            this.load.audio("p2block", "project_assets/sounds/dwarf/block.wav");
            this.load.audio("p2skill1", "project_assets/sounds/dwarf/skill1.wav");
            this.load.audio("p2skill2", "project_assets/sounds/dwarf/skill2.wav");
            this.load.audio("p2skill3", "project_assets/sounds/dwarf/skill3.wav");
        }
    }
}