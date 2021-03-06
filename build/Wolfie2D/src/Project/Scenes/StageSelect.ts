import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./Level1";
import HomeScreen from "./HomeScreen";
import Level4 from "./Level4";
import Level2 from "./Level2";
import Level5 from "./Level5";
import Level3 from "./Level3";
import Level6 from "./Level6";


export default class StageSelect extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;
    protected initOptions: Record<string, any>;
    protected isAI: boolean;
    protected p1: String;
    protected p1Skillset: String;
    protected p2: String;
    protected p2Skillset: String;
    protected stageUnlocked: number;    // latest stage unlocked. starts at 1 and maxes at 6.

    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }

    loadScene(): void {
        this.load.image("stgsel", "project_assets/backgrounds/stgsel.png");
        this.load.image("lock", "project_assets/ui/lock.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);
        
        console.log('level unlocked: ' + this.stageUnlocked);
        this.stageUnlocked = this.initOptions.stageUnlocked;

        this.isAI = this.initOptions.isP2AI

        this.p1 = this.initOptions.p1
        this.p1Skillset = this.initOptions.p1Skillset
        this.p2 = this.initOptions.p2
        this.p2Skillset = this.initOptions.p2Skillset

        if(this.initOptions.stageUnlocked > this.stageUnlocked)
            this.stageUnlocked = this.initOptions.stageUnlocked

        this.bg = this.add.sprite("stgsel", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 320), text: "Back"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.TRANSPARENT;
        backBtn.textColor = Color.TRANSPARENT;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(90, 30));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
        }

        // Create a stage1 button
        let stage1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 200, size.y - 150), text: "Meadow"});
        stage1Btn.backgroundColor = Color.TRANSPARENT;
        stage1Btn.borderColor = Color.TRANSPARENT;
        stage1Btn.textColor = Color.BLACK;
        stage1Btn.borderRadius = 0;
        stage1Btn.setPadding(new Vec2(60, 30));
        stage1Btn.font = "PixelSimple";

        // When the stage1 button is clicked, go to the next scene
        stage1Btn.onClick = () => {
            let sceneOptions = {
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
            if(!this.isAI){      // player v player
                this.sceneManager.changeToScene(Level1, { 
                    map: "project_assets/tilemaps/meadow.json",
                    p1: this.p1,
                    p2: this.p2,
                    p1Skillset: this.p1Skillset, 
                    p2Skillset: this.p2Skillset, 
                    isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                }, sceneOptions);
            } else { // player v ai (predertermined opponent char based on stage)
                this.sceneManager.changeToScene(Level1, { 
                    map: "project_assets/tilemaps/meadow.json",
                    p1: this.p1,
                    p2: "project_assets/spritesheets/fighter.json",
                    p1Skillset: this.p1Skillset, 
                    p2Skillset: "project_assets/skills/fighter.json", 
                    isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                }, sceneOptions);
            }
        }
        

        if(this.stageUnlocked >= 2 || !this.isAI){
            // Create a stage2 button
            let stage2Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 150), text: "Beach"});
            stage2Btn.backgroundColor = Color.TRANSPARENT;
            stage2Btn.borderColor = Color.TRANSPARENT;
            stage2Btn.textColor = Color.CYAN;
            stage2Btn.borderRadius = 0;
            stage2Btn.setPadding(new Vec2(60, 30));
            stage2Btn.font = "PixelSimple";

            // When the stage2 button is clicked, go to the next scene
            stage2Btn.onClick = () => {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
                let sceneOptions = {
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
                if(!this.isAI){      // player v player
                    this.sceneManager.changeToScene(Level2, { 
                        map: "project_assets/tilemaps/beach.json",
                        p1: this.p1,
                        p2: this.p2,
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: this.p2Skillset, 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                } else { // player v ai (predertermined opponent char based on stage)
                    this.sceneManager.changeToScene(Level2, { 
                        map: "project_assets/tilemaps/beach.json",
                        p1: this.p1,
                        p2: "project_assets/spritesheets/waterlady.json",
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: "project_assets/skills/waterlady.json", 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                }
            }
        } else {
            console.log('sadasdasdas')
            let lock = this.add.sprite("lock", "Main");
            lock.scale.set(2, 2);
            lock.position.copy(size);
            lock.position.add(new Vec2(0, -150));
        }

        if(this.stageUnlocked >= 3 || !this.isAI){
            // Create a stage3 button
            let stage3Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x+200, size.y - 150), text: "Mountain"});
            stage3Btn.backgroundColor = Color.TRANSPARENT;
            stage3Btn.borderColor = Color.TRANSPARENT;
            stage3Btn.textColor = new Color(128,128,128);
            stage3Btn.borderRadius = 0;
            stage3Btn.setPadding(new Vec2(60, 30));
            stage3Btn.font = "PixelSimple";

            // When the stage3 button is clicked, go to the next scene
            stage3Btn.onClick = () => {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
                let sceneOptions = {
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
                if(!this.isAI){      // player v player
                    this.sceneManager.changeToScene(Level3, {    
                        map: "project_assets/tilemaps/Mountain.json",
                        p1: this.p1,
                        p2: this.p2,
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: this.p2Skillset, 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                } else { // player v ai (predertermined opponent char based on stage)
                    this.sceneManager.changeToScene(Level3, {            
                        map: "project_assets/tilemaps/Mountain.json",
                        p1: this.p1,
                        p2: "project_assets/spritesheets/dwarf.json",
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: "project_assets/skills/dwarf.json", 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                }
            }
        }else {
            let lock = this.add.sprite("lock", "Main");
            lock.scale.set(2, 2);
            lock.position.copy(size);
            lock.position.add(new Vec2(200, -150));
        }

        if(this.stageUnlocked >= 4 || !this.isAI){
            // Create a stage4 button
            let stage4Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 200, size.y+70), text: "City"});
            stage4Btn.backgroundColor = Color.TRANSPARENT;
            stage4Btn.borderColor = Color.TRANSPARENT;
            stage4Btn.textColor = Color.WHITE;
            stage4Btn.borderRadius = 0;
            stage4Btn.setPadding(new Vec2(60, 30));
            stage4Btn.font = "PixelSimple";

            // When the stage4 button is clicked, go to the next scene
            stage4Btn.onClick = () => {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
                let sceneOptions = {
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
                if(!this.isAI){      // player v player
                    this.sceneManager.changeToScene(Level4, {           
                        map: "project_assets/tilemaps/cityscape.json",
                        p1: this.p1,
                        p2: this.p2,
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: this.p2Skillset, 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                } else { // player v ai (predertermined opponent char based on stage)
                    this.sceneManager.changeToScene(Level4, {           
                        map: "project_assets/tilemaps/cityscape.json",
                        p1: this.p1,
                        p2: "project_assets/spritesheets/fighter.json",
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: "project_assets/skills/fighter.json", 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                }
            }
        }else {
            let lock = this.add.sprite("lock", "Main");
            lock.scale.set(2, 2);
            lock.position.copy(size);
            lock.position.add(new Vec2(-200, 70));
        }

        if(this.stageUnlocked >= 5 || !this.isAI){
            // Create a stage5 button
            let stage5Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y+70), text: "UnderSea"});
            stage5Btn.backgroundColor = Color.TRANSPARENT;
            stage5Btn.borderColor = Color.TRANSPARENT;
            stage5Btn.textColor = Color.BLACK;
            stage5Btn.borderRadius = 0;
            stage5Btn.setPadding(new Vec2(60, 30));
            stage5Btn.font = "PixelSimple";

            // When the stage5 button is clicked, go to the next scene
            stage5Btn.onClick = () => {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
                let sceneOptions = {
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
                if(!this.isAI){      // player v player
                    this.sceneManager.changeToScene(Level5, {           
                        map: "project_assets/tilemaps/undersea.json",
                        p1: this.p1,
                        p2: this.p2,
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: this.p2Skillset, 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                } else { // player v ai (predertermined opponent char based on stage)
                    this.sceneManager.changeToScene(Level5, {           
                        map: "project_assets/tilemaps/undersea.json",
                        p1: this.p1,
                        p2: "project_assets/spritesheets/waterlady.json",
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: "project_assets/skills/waterlady.json", 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                }
            }
        }else {
            let lock = this.add.sprite("lock", "Main");
            lock.scale.set(2, 2);
            lock.position.copy(size);
            lock.position.add(new Vec2(0, 70));
        }

        if(this.stageUnlocked >= 6 || !this.isAI){
            // Create a stage6 button
            let stage6Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x+200, size.y+70), text: "Volcano"});
            stage6Btn.backgroundColor = Color.TRANSPARENT;
            stage6Btn.borderColor = Color.TRANSPARENT;
            stage6Btn.textColor = Color.RED;
            stage6Btn.borderRadius = 0;
            stage6Btn.setPadding(new Vec2(60, 30));
            stage6Btn.font = "PixelSimple";

            // When the stage6 button is clicked, go to the next scene
            stage6Btn.onClick = () => {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
                let sceneOptions = {
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
                if(!this.isAI){      // player v player
                    this.sceneManager.changeToScene(Level6, {
                        map: "project_assets/tilemaps/volcano.json",
                        p1: this.p1,
                        p2: this.p2,
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: this.p2Skillset, 
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                } else { // player v ai (predertermined opponent char based on stage)
                    this.sceneManager.changeToScene(Level6, {            //change to level6 later!
                        map: "project_assets/tilemaps/volcano.json",
                        p1: this.p1,
                        p2: "project_assets/spritesheets/dwarf.json",
                        p1Skillset: this.p1Skillset, 
                        p2Skillset: "project_assets/skills/dwarf.json",
                        isP2AI: this.isAI,stageUnlocked: this.stageUnlocked
                    }, sceneOptions);
                }
            }
        }else {
            let lock = this.add.sprite("lock", "Main");
            lock.scale.set(2, 2);
            lock.position.copy(size);
            lock.position.add(new Vec2(200, 70));
        }

        
        
    }

    unloadScene(): void {
        HomeScreen.startTime = 0;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
    }
}