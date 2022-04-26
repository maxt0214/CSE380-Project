import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import HomeScreen from "./HomeScreen";

export default class Controls extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("controls", "project_assets/backgrounds/Controlsnew.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


        this.bg = this.add.sprite("controls", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 300), text: "Back aaaaaaaaaaa"});
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
        
    }

    unloadScene(): void {
    }
}

