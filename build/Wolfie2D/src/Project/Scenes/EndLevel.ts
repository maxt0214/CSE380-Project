import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import GameLevel from "./GameLevel";
import HomeScreen from "./HomeScreen";

enum LevelName {
    MEADOW = "meadow",
    BEACH = "beach",
    MOUNTAIN = "mountain",
    CITY = "city",
    UNDERSEA = "undersea",
    VOLCANO = "volcano"
}

//EndLevel to only play end music. Then transit back to Homescreen
export default class EndLevel extends GameLevel {
    timer: number = 5;
    curr_scene_cut: number = 0;
    scenecuts: Sprite[];

    levelEndLabel: Label;
    color_timer: number = 1;
    curr_color: number = 0;
    colors: Color[] = [Color.RED, Color.CYAN, Color.ORANGE, Color.BLACK, Color.GREEN, Color.MAGENTA, Color.WHITE, Color.YELLOW];
    
    loadScene(): void {
        this.load.audio("level_music", "project_assets/music/end.mp3");
        this.initscenecut(this.initOptions.p1);
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.unloadAllResources();
    }

    startScene(): void { 
        this.addUILayer("UI");
        this.addLayer("background", 0);
        this.viewport.follow(null);
        //Center view port
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setCenter(size);
        this.viewport.setZoomLevel(1);
        //init scenecuts
        this.scenecuts = [];
        this.addscenecut(LevelName.MEADOW);
        this.addscenecut(LevelName.BEACH);
        this.addscenecut(LevelName.MOUNTAIN);
        this.addscenecut(LevelName.CITY);
        this.addscenecut(LevelName.UNDERSEA);
        this.addscenecut(LevelName.VOLCANO);
        this.changescenecut();
        //Wining text
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(size.x, size.y), text: "You Won! Our New Champion!"});
        this.levelEndLabel.size.set(600, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = Color.TRANSPARENT;
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Create a back button
        let backBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(size.x + 380, size.y - 320), text: "Back"});
        backBtn.backgroundColor = Color.TRANSPARENT;
        backBtn.borderColor = Color.WHITE;
        backBtn.textColor = Color.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2(80, 30));
        backBtn.font = "PixelSimple";
    
        // When the skip button is clicked, back to home screen
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(HomeScreen, {stageUnlocked: this.stageUnlocked}, {});
        }

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        if(this.timer <= 0) {
            this.curr_scene_cut = this.curr_scene_cut >= 5 ? 0 : this.curr_scene_cut+1;
            this.changescenecut();
            this.timer = 5;
        }

        if(this.color_timer <= 0) {
            this.levelEndLabel.textColor = this.colors[this.curr_color];
            this.curr_color = this.curr_color >= (this.colors.length-1) ? 0 : this.curr_color+1;
            this.color_timer = 1;
        }

        this.timer -= deltaT;
        this.color_timer -= deltaT;
    }

    addscenecut(scene: LevelName) {
        var bg = this.add.sprite(scene, "background");
        bg.scale.set(3.75, 2.5);
		bg.position.copy(this.viewport.getCenter());
        bg.visible = false;
        this.scenecuts.push(bg);
    }

    changescenecut() {
        for(let i = 0; i < 6; i++) {
            this.scenecuts[i].visible = (i === this.curr_scene_cut);
        }
    }

    initscenecut(character: string) {
        if(character.includes("fighter")) {
            this.load.image(LevelName.MEADOW, "project_assets/scenecut/meadow_fighter.png");
            this.load.image(LevelName.BEACH, "project_assets/scenecut/beach_fighter.png");
            this.load.image(LevelName.MOUNTAIN, "project_assets/scenecut/mountain_fighter.png");
            this.load.image(LevelName.CITY, "project_assets/scenecut/city_fighter.png");
            this.load.image(LevelName.UNDERSEA, "project_assets/scenecut/undersea_fighter.png");
            this.load.image(LevelName.VOLCANO, "project_assets/scenecut/volcano_fighter.png");
        }

        if(character.includes("waterlady")) {
            this.load.image(LevelName.MEADOW, "project_assets/scenecut/meadow_waterlady.png");
            this.load.image(LevelName.BEACH, "project_assets/scenecut/beach_waterlady.png");
            this.load.image(LevelName.MOUNTAIN, "project_assets/scenecut/mountain_waterlady.png");
            this.load.image(LevelName.CITY, "project_assets/scenecut/city_waterlady.png");
            this.load.image(LevelName.UNDERSEA, "project_assets/scenecut/undersea_waterlady.png");
            this.load.image(LevelName.VOLCANO, "project_assets/scenecut/volcano_waterlady.png");
        }

        if(character.includes("dwarf")) {
            this.load.image(LevelName.MEADOW, "project_assets/scenecut/meadow_dwarf.png");
            this.load.image(LevelName.BEACH, "project_assets/scenecut/beach_dwarf.png");
            this.load.image(LevelName.MOUNTAIN, "project_assets/scenecut/mountain_dwarf.png");
            this.load.image(LevelName.CITY, "project_assets/scenecut/city_dwarf.png");
            this.load.image(LevelName.UNDERSEA, "project_assets/scenecut/undersea_dwarf.png");
            this.load.image(LevelName.VOLCANO, "project_assets/scenecut/volcano_dwarf.png");
        }
    }
}