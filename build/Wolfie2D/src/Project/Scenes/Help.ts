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

    loadScene(): void {
        this.load.image("help", "project_assets/backgrounds/Helpbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);


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
            this.sceneManager.changeToScene(CharProfiles, {}, {});
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
            this.sceneManager.changeToScene(HomeScreen, {}, {});
        }

        
    }

    unloadScene(): void {
    }
}

