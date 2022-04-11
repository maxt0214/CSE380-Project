import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import HomeScreen from "./HomeScreen";
import CharSelect from "./CharSelect";

export default class GameModes extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("modes", "project_assets/backgrounds/GameModesbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


        this.bg = this.add.sprite("modes", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 320, size.y + 280), text: "Back"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {}, {});
        }

        // Create a story button
        let storyBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x -320, size.y - 200), text: "Story Mode"});
        storyBtn.backgroundColor = Color.TRANSPARENT;
        storyBtn.borderColor = Color.WHITE;
        storyBtn.borderRadius = 0;
        storyBtn.setPadding(new Vec2(80, 30));
        storyBtn.font = "PixelSimple";

        //button click
        storyBtn.onClick = () => {
            this.sceneManager.changeToScene(CharSelect, {}, {});
        }
    }

    unloadScene(): void {
    }
}

