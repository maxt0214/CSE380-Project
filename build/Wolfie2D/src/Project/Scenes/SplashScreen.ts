import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import HomeScreen from "./HomeScreen";
import StageSelect from "./StageSelect"; 

export default class SplashScreen extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;
    protected stageUnlocked: number = 1;    // latest stage unlocked. starts at 1 and maxes at 6.
    protected initOptions: Record<string, any>;

    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }
    loadScene(): void {
        this.load.image("splash", "project_assets/backgrounds/SplashScreenbig.png");
        //this.load.audio("splash_sound", "project_assets/music/splashclick.wav");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);
        this.stageUnlocked =1;

        this.bg = this.add.sprite("splash", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        
        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 320), text: "Start Game"});
        playBtn.backgroundColor = Color.TRANSPARENT;
        playBtn.textColor = Color.TRANSPARENT;
        playBtn.borderColor = Color.TRANSPARENT;
        playBtn.borderRadius = 0;
        playBtn.setPadding(new Vec2(80, 30));
        playBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
        }


        let skipBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 300, size.y - 3200), text: "Skip to gameplay"});
        skipBtn.backgroundColor = Color.TRANSPARENT;
        skipBtn.borderColor = Color.WHITE;
        skipBtn.borderRadius = 0;
        skipBtn.setPadding(new Vec2(80, 30));
        skipBtn.font = "PixelSimple";
        skipBtn.fontSize = 20;

        // When the skip button is clicked, go to the next scene
        skipBtn.onClick = () => {
            this.sceneManager.changeToScene(StageSelect, {stageUnlocked: 1}, {});
        }
    }

    unloadScene(): void {
    }
}

