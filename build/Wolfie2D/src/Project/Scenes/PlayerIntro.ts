import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import HomeScreen from "./HomeScreen";

//EndLevel to only play end music. Then transit back to Homescreen
export default class EndLevel extends Scene {
    timer: number = 5;
    curr_scene_cut: number = 0;
    scenecuts: Sprite[];
    descrips: string[];

    descripLabel: Label;

    protected initOptions: Record<string, any>;
    protected stageUnlocked: number;    // latest stage unlocked. starts at 1 and maxes at 6.
    initScene(init: Record<string, any>): void {
        this.initOptions = init;
    }
    loadScene(): void {
        this.load.image("fighter_bg", "project_assets/intro_scenecut/fighter.png");
        this.load.image("waterlady_bg", "project_assets/intro_scenecut/waterlady.png");
        this.load.image("dwarf_bg", "project_assets/intro_scenecut/dwarf.png");
        this.load.audio("menu_music", "project_assets/music/menu.mp3");
    }

    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu_music"});
        this.resourceManager.keepAudio("splash_sound");
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        this.addUILayer("UI");
        this.addLayer("background", 0);
        //Center view port
        let size = this.viewport.getHalfSize();
        this.viewport.setZoomLevel(1);
        //Wining text
	    this.stageUnlocked = this.initOptions.stageUnlocked;
        this.descripLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(size.x, size.y), text: ""});
        this.descripLabel.size.set(600, 60);
        this.descripLabel.borderRadius = 0;
        this.descripLabel.backgroundColor = Color.TRANSPARENT;
        this.descripLabel.textColor = Color.WHITE;
        this.descripLabel.fontSize = 20;
        this.descripLabel.font = "PixelSimple";
        //init scenecuts
        this.scenecuts = [];
        this.descrips = [
            "Fighter is good at Judo. He has never lost in close combat, and everyone predicts that he will be the champion this year!",
            "Waterlady is a mysterious lady. She is a natural when manipulating water. Feel the power of water!",
            "The dwarf miner is a master of crystal power. I am sure you will fear his sharp crystal blade!"
        ];
        this.addscenecut("fighter_bg");
        this.addscenecut("waterlady_bg");
        this.addscenecut("dwarf_bg");
        this.changescenecut();

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(size.x + 380, size.y - 320), text: "Skip"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.textColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";
    
        // When the skip button is clicked, to homescene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
        }
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        if(this.timer <= 0) {
            if(this.curr_scene_cut >= 3) {
                this.sceneManager.changeToScene(HomeScreen, {}, {});
                return;
            }
            this.changescenecut();
            this.timer = 5;
            this.curr_scene_cut++;
        }

        this.timer -= deltaT;
    }

    addscenecut(scene: string) {
        var bg = this.add.sprite(scene, "background");
        bg.scale.set(4, 4);
		bg.position.copy(this.viewport.getCenter());
        bg.visible = false;
        this.scenecuts.push(bg);
    }

    changescenecut() {
        for(let i = 0; i < 3; i++) {
            this.scenecuts[i].visible = (i === this.curr_scene_cut);
        }
        this.descripLabel.text = this.descrips[this.curr_scene_cut];
        if(this.curr_scene_cut === 0) this.descripLabel.textColor = Color.BLACK;
        else if(this.curr_scene_cut === 1) this.descripLabel.textColor = new Color(0,76,153);
        else this.descripLabel.textColor = new Color(255,153,51);
    }
}
