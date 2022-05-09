import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import EndLevel from "./EndLevel";
import GameLevel from "./GameLevel";
import HomeScreen from "./HomeScreen";

export default class Level6 extends GameLevel {

    loadScene(): void {
        super.loadScene();
        this.load.audio("level_music", "project_assets/music/volcano.mp3");
        this.load.audio("hit", "project_assets/sounds/hit.wav");
        this.loadp1Sound(this.initOptions.p1Skillset);
        this.loadp2Sound(this.initOptions.p2Skillset);
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        this.nextLevel = EndLevel;
        this.add.tilemap("level", new Vec2(2, 2));//this is loaded in loadScene in gamelevel
        //TODO: Change viewport
        this.viewport.setBounds(0, 0, 21*32, 20*32); 

        this.player1Spawn = new Vec2(8*32, 8*32);
        this.player2Spawn = new Vec2(14*32, 8*32);

        // Do generic setup for a GameLevel
        super.startScene();
        this.nextLevelNum = 6;
        //this.level_is_last = true;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}