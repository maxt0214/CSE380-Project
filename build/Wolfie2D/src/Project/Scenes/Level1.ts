import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {

    loadScene(): void {
        super.loadScene();
        // Load common resources
        this.load.audio("jump", "project_assets/sounds/jump.wav");
        this.load.audio("player_death", "project_assets/sounds/player_death.wav");
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        this.add.tilemap("level", new Vec2(2, 2));//this is loaded in loadScene in gamelevel
        //TODO: Change viewport
        this.viewport.setBounds(0, 0, 64*32, 20*32); 

        this.player1Spawn = new Vec2(5*32, 14*32);
        this.player2Spawn = new Vec2(7*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();
        
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}