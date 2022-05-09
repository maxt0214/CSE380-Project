import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import HomeScreen from "./HomeScreen";
import CharProfiles from "./CharProfiles";


export default class HelpScreen extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;
    protected stageUnlocked: number;    // latest stage unlocked. starts at 1 and maxes at 6.
    protected initOptions: Record<string, any>;
    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }
    loadScene(): void {
        this.load.image("help", "project_assets/backgrounds/Help.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);
        this.stageUnlocked = this.initOptions.stageUnlocked;


        this.bg = this.add.sprite("help", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        
        // Create a charprofiles button
        let charpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 20), text: "Character Profiles aaa"});
        charpBtn.backgroundColor = Color.TRANSPARENT;
        charpBtn.borderColor = Color.TRANSPARENT;
        charpBtn.textColor = Color.TRANSPARENT;
        charpBtn.borderRadius = 0;
        charpBtn.setPadding(new Vec2(80, 30));
        charpBtn.font = "PixelSimple";

        // When the charp button is clicked, go to the next scene
        charpBtn.onClick = () => {
            this.sceneManager.changeToScene(CharProfiles, {stageUnlocked: this.stageUnlocked}, {});
        }

        // Create a back button
        let back1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 300), text: "Back aaaaaaaaaaaa"});
        back1Btn.backgroundColor = Color.TRANSPARENT;
        back1Btn.borderColor = Color.TRANSPARENT;
        back1Btn.textColor = Color.TRANSPARENT;
        back1Btn.borderRadius = 0;
        back1Btn.setPadding(new Vec2(80, 30));
        back1Btn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        back1Btn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
        }

        // Create a cheat button
        let cheatBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 220, size.y + 150), text: "Unlock"});
        cheatBtn.backgroundColor = Color.TRANSPARENT;
        cheatBtn.borderColor = Color.TRANSPARENT;
        cheatBtn.textColor = Color.TRANSPARENT;
        cheatBtn.borderRadius = 0;
        cheatBtn.setPadding(new Vec2(80, 30));
        cheatBtn.font = "PixelSimple";

        // When the cheat button is clicked, go to the next scene
        cheatBtn.onClick = () => {
            this.stageUnlocked = 6;
        }
        
    }

    unloadScene(): void {
    }
}

