import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Level4 from "./Level4";

export default class Level3 extends GameLevel {

    loadScene(): void {
        super.loadScene();
        this.load.audio("level_music", "project_assets/music/mountain.mp3");
        this.load.audio("hit", "project_assets/sounds/hit.wav");
        this.loadp1Sound(this.initOptions.p1Skillset);
        this.loadp2Sound(this.initOptions.p2Skillset);
    }

    

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.keepAudio("splash_sound");
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        this.add.tilemap("level", new Vec2(2, 2));//this is loaded in loadScene in gamelevel
        //TODO: Change viewport
        this.viewport.setBounds(0, 0, 21*32, 20*32); 

        this.player1Spawn = new Vec2(7*32, 14*32);
        this.player2Spawn = new Vec2(14*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();

        this.nextLevel = Level4;
        this.nextMap = "project_assets/tilemaps/cityscape.json";
        this.nextEnemy = "project_assets/spritesheets/fighter.json";
        this.nextEnemySkillset =  "project_assets/skills/fighter.json";
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}