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
import HomeScreen from "./HomeScreen";

export default class CharSelect extends Scene {
    animatedSprite: AnimatedSprite;
    private bg: Sprite;
    protected initOptions: Record<string, any>;
    protected isAI: boolean;
    protected p1: String = "no char";
    protected p1Skillset: String;
    protected p2: String = "no char";
    protected p2Skillset: String;

    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }

    loadScene(): void {
        this.load.image("charsel", "project_assets/backgrounds/CharacterSelectbig.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("background", 0);

        this.isAI = this.initOptions.isP2AI

        this.bg = this.add.sprite("charsel", "background");
        this.bg.scale.set(1, 1);
		this.bg.position.copy(this.viewport.getCenter());

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 320), text: "Back aaaaa"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.TRANSPARENT;
        backBtn.textColor = Color.TRANSPARENT;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";

        // When the back button is clicked, go to the next scene
        backBtn.onClick = () => {
            //this.sceneManager.changeToScene(GameModes, {}, {});
            this.sceneManager.changeToScene(HomeScreen, {}, {});

        }

        // Create a cont button
        let contBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 180), text: "Continue"});
        contBtn.backgroundColor = Color.TRANSPARENT;
        contBtn.borderColor = Color.TRANSPARENT;
        contBtn.textColor = Color.TRANSPARENT;
        contBtn.borderRadius = 0;
        contBtn.setPadding(new Vec2(80, 30));
        contBtn.font = "PixelSimple";

        // When the cont button is clicked, go to the next scene
        contBtn.onClick = () => {
            if(this.p1 !== "no char" && (this.p2 !== "no char" || this.isAI))       // if p1 has a char and p2 has a char or is an AI, you can continue
                this.sceneManager.changeToScene(StageSelect, {
                isP2AI: this.isAI,
                p1: this.p1,
                p1Skillset: this.p1Skillset,
                p2: this.p2,
                p2Skillset: this.p2Skillset
                }, {});
        }
        


        // Create a char1 button
        let char1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x - 250, size.y - 150), text: "Char 1"});
        char1Btn.backgroundColor = Color.TRANSPARENT;
        char1Btn.borderColor = Color.WHITE;
        char1Btn.borderRadius = 0;
        char1Btn.setPadding(new Vec2(80, 30));
        char1Btn.font = "PixelSimple";

        // When the char1 button is clicked, handle changing char
        char1Btn.onClick = () => {
            if(this.p1 === "no char"){          //if p1 has not chosen a char, make them the char that this button assigns them to
                this.p1 = "project_assets/spritesheets/fighter.json";
                this.p1Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 1 chose char 1`);
            } else if(this.p2 === "no char" && !this.isAI){          // if p1 has already chosen a char AND if p2 has not chosen a char AND p2 is not an AI ...
                this.p2 = "project_assets/spritesheets/fighter.json";
                this.p2Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 2 chose char 1`);
            }
        }

        // Create a char2 button
        let char2Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 150), text: "Char 2"});
        char2Btn.backgroundColor = Color.TRANSPARENT;
        char2Btn.borderColor = Color.WHITE;
        char2Btn.borderRadius = 0;
        char2Btn.setPadding(new Vec2(80, 30));
        char2Btn.font = "PixelSimple";

        // When the char2 button is clicked, handle changing char
        char2Btn.onClick = () => {
            if(this.p1 === "no char"){          //if p1 has not chosen a char, make them the char that this button assigns them to
                this.p1 = "project_assets/spritesheets/fighter.json";
                this.p1Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 1 chose char 2`);
            } else if(this.p2 === "no char" && !this.isAI){          // if p1 has already chosen a char AND if p2 has not chosen a char AND p2 is not an AI ...
                this.p2 = "project_assets/spritesheets/fighter.json";
                this.p2Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 2 chose char 2`);
            }
        }

        // Create a char3 button
        let char3Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x + 250 , size.y - 150), text: "Char 3"});
        char3Btn.backgroundColor = Color.TRANSPARENT;
        char3Btn.borderColor = Color.WHITE;
        char3Btn.borderRadius = 0;
        char3Btn.setPadding(new Vec2(80, 30));
        char3Btn.font = "PixelSimple";

        // When the char3 button is clicked, handle changing char
        char3Btn.onClick = () => {
            if(this.p1 === "no char"){          //if p1 has not chosen a char, make them the char that this button assigns them to
                this.p1 = "project_assets/spritesheets/fighter.json";
                this.p1Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 1 chose char 3`);
            } else if(this.p2 === "no char" && !this.isAI){          // if p1 has already chosen a char AND if p2 has not chosen a char AND p2 is not an AI ...
                this.p2 = "project_assets/spritesheets/fighter.json";
                this.p2Skillset = "project_assets/skills/fighter.json";
                console.log(`Player 2 chose char 3`);
            }
        }

    }

    unloadScene(): void {
    }
}
