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


export default class StageSelect extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("stgsel", "project_assets/backgrounds/StageSelectbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


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
        backBtn.borderColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(GameModes, {}, {});
        }

        // Create a cont button
        let contBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 100, size.y - 100), text: "Stage 1"});
        contBtn.backgroundColor = Color.TRANSPARENT;
        contBtn.borderColor = Color.WHITE;
        contBtn.borderRadius = 0;
        contBtn.setPadding(new Vec2(80, 30));
        contBtn.font = "PixelSimple";

        // When the cont button is clicked, go to the next scene
        contBtn.onClick = () => {
            
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "props"],
                    collisions:
                    [
                        [0, 1, 0],
                        [1, 0, 1],
                        [0, 1, 0]
                    ]
                }
            }
            this.sceneManager.changeToScene(Level1, { 
                map: "project_assets/tilemaps/meadow.json",
                p1: "project_assets/spritesheets/fighter.json",
                p2: "project_assets/spritesheets/fighter.json",
                
                p1Skillset: "project_assets/skills/fighter.json", 
                p2Skillset: "project_assets/skills/fighter.json", 
                isP2AI: false 
            }, sceneOptions);
        }
    }

    unloadScene(): void {
    }
}