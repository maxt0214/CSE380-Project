import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameModes from "./GameModes";
import Level1 from "./Level1";
import HomeScreen from "./HomeScreen";


export default class StageSelect extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;
    protected initOptions: Record<string, any>;
    protected isAI: boolean;

    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }

    loadScene(): void {
        this.load.image("stgsel", "project_assets/backgrounds/StageSelectbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);
        
        this.isAI = this.initOptions.isP2AI


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
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {}, {});
        }

        // Create a stage1 button
        let stage1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 250, size.y - 150), text: "Stage 1"});
        stage1Btn.backgroundColor = Color.TRANSPARENT;
        stage1Btn.borderColor = Color.WHITE;
        stage1Btn.borderRadius = 0;
        stage1Btn.setPadding(new Vec2(80, 30));
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
            this.sceneManager.changeToScene(Level1, { 
                map: "project_assets/tilemaps/meadow.json",
                p1: "project_assets/spritesheets/fighter.json",
                p2: "project_assets/spritesheets/fighter.json",
                
                p1Skillset: "project_assets/skills/fighter.json", 
                p2Skillset: "project_assets/skills/fighter.json", 
                isP2AI: this.isAI
            }, sceneOptions);
        }

        // Create a stage2 button
        let stage2Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 150), text: "Stage 2"});
        stage2Btn.backgroundColor = Color.TRANSPARENT;
        stage2Btn.borderColor = Color.WHITE;
        stage2Btn.borderRadius = 0;
        stage2Btn.setPadding(new Vec2(80, 30));
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
            this.sceneManager.changeToScene(Level1, { 
                map: "project_assets/tilemaps/beach.json",
                p1: "project_assets/spritesheets/fighter.json",
                p2: "project_assets/spritesheets/fighter.json",
                
                p1Skillset: "project_assets/skills/fighter.json", 
                p2Skillset: "project_assets/skills/fighter.json", 
                isP2AI: this.isAI
            }, sceneOptions);
        }
    }

    unloadScene(): void {
        HomeScreen.startTime = 0;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
    }
}