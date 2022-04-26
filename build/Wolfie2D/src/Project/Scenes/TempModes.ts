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

export default class TempModes extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;

    loadScene(): void {
        this.load.image("tmodes", "project_assets/backgrounds/TempMenu.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


        this.bg = this.add.sprite("tmodes", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 320, size.y + 260), text: "Back aaaaaaaaaa"});
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

        // Create a vs ai button
        let aiBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x -320, size.y - 200), text: "ai Mode aaaaaaaa"});
        aiBtn.backgroundColor = Color.TRANSPARENT;
        aiBtn.borderColor = Color.TRANSPARENT;
        aiBtn.textColor = Color.TRANSPARENT;
        aiBtn.borderRadius = 0;
        aiBtn.setPadding(new Vec2(80, 30));
        aiBtn.font = "PixelSimple";

        //button click
        aiBtn.onClick = () => {
            this.sceneManager.changeToScene(CharSelect, {isP2AI: true}, {});
        }

        // Create a vs pvp button
        let pvpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x -320, size.y - 40), text: "pvp Mode aaaaaaa"});
        pvpBtn.backgroundColor = Color.TRANSPARENT;
        pvpBtn.borderColor = Color.TRANSPARENT;
        pvpBtn.textColor = Color.TRANSPARENT;
        pvpBtn.borderRadius = 0;
        pvpBtn.setPadding(new Vec2(80, 30));
        pvpBtn.font = "PixelSimple";

        //button click
        pvpBtn.onClick = () => {
            this.sceneManager.changeToScene(CharSelect, {isP2AI: false }, {});
        }
    }

    unloadScene(): void {
    }
}

