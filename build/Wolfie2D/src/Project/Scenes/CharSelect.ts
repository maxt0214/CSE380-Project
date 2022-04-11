import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import GameModes from "./GameModes";
import StageSelect from "./StageSelect";

export default class CharSelect extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("charsel", "project_assets/backgrounds/CharacterSelectbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


        this.bg = this.add.sprite("charsel", "background");
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
        let contBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 220), text: "Continue"});
        contBtn.backgroundColor = Color.TRANSPARENT;
        contBtn.borderColor = Color.WHITE;
        contBtn.borderRadius = 0;
        contBtn.setPadding(new Vec2(80, 30));
        contBtn.font = "PixelSimple";

        // When the cont button is clicked, go to the next scene
        contBtn.onClick = () => {
            this.sceneManager.changeToScene(StageSelect, {}, {});
        }
        
    }

    unloadScene(): void {
    }
}
