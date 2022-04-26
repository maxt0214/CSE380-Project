import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Controls from "./Controls";
import Tutorial from "./tutorial";
import HelpScreen from "./Help";
import GameModes from "./GameModes";
import TempModes from "./TempModes";

export default class HomeScreen extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("home", "project_assets/backgrounds/HomeMenubig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);
        
        this.viewport.setCenter(600,400);
        this.bg = this.add.sprite("home", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a help button
        let helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 320, size.y + 280), text: "Help aaaaaaaaa"});
        helpBtn.backgroundColor = Color.TRANSPARENT;
        helpBtn.borderColor = Color.TRANSPARENT;
        helpBtn.textColor = Color.TRANSPARENT;
        helpBtn.borderRadius = 0;
        helpBtn.setPadding(new Vec2(80, 30));
        helpBtn.font = "PixelSimple";

        //button click
        helpBtn.onClick = () => {
            this.sceneManager.changeToScene(HelpScreen, {}, {});
        }

        // Create a tutorial button
        let tutorialBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 320, size.y + 120), text: "Tutorial aaaaaa"});
        tutorialBtn.backgroundColor = Color.TRANSPARENT;
        tutorialBtn.borderColor = Color.TRANSPARENT;
        tutorialBtn.textColor = Color.TRANSPARENT;
        tutorialBtn.borderRadius = 0;
        tutorialBtn.setPadding(new Vec2(80, 30));
        tutorialBtn.font = "PixelSimple";

        //button click
        tutorialBtn.onClick = () => {
            this.sceneManager.changeToScene(Tutorial, {}, {});
        }

        // Create a controls button
        let controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x -320, size.y - 40), text: "Controls aaaaaa"});
        controlsBtn.backgroundColor = Color.TRANSPARENT;
        controlsBtn.borderColor = Color.TRANSPARENT;
        controlsBtn.textColor = Color.TRANSPARENT;
        controlsBtn.borderRadius = 0;
        controlsBtn.setPadding(new Vec2(80, 30));
        controlsBtn.font = "PixelSimple";

        //button click
        controlsBtn.onClick = () => {
            this.sceneManager.changeToScene(Controls, {}, {});
        }

        // Create a modes button
        let modesBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x -320, size.y - 200), text: "Play Game aaaaa"});
        modesBtn.backgroundColor = Color.TRANSPARENT;
        modesBtn.borderColor = Color.TRANSPARENT;
        modesBtn.textColor = Color.TRANSPARENT;
        modesBtn.borderRadius = 0;
        modesBtn.setPadding(new Vec2(80, 30));
        modesBtn.font = "PixelSimple";

        //button click
        modesBtn.onClick = () => {
            console.log("Hello.............................");
            //this.sceneManager.changeToScene(GameModes, {}, {});
            this.sceneManager.changeToScene(TempModes, {}, {});

        }
    }

    unloadScene(): void {
    }
}