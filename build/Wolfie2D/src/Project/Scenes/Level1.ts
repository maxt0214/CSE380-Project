import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    

    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "project_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "project_assets/spritesheets/spike.json");
        this.load.spritesheet("red", "project_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "project_assets/spritesheets/blueBalloon.json");
        this.load.audio("jump", "project_assets/sounds/jump.wav");
        this.load.audio("switch", "project_assets/sounds/switch.wav");
        this.load.audio("player_death", "project_assets/sounds/player_death.wav");
        this.load.audio("ballon_pop", "project_assets/sounds/ballonpop.wav");
        this.load.audio("level_music", "project_assets/music/levelmusic.wav");
    }

    unloadScene(){
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        //Do not keep anything related to player. These will be loaded differently each timme dependent on player choice
        this.resourceManager.keepSpritesheet("player");
        this.resourceManager.keepSpritesheet("red");
        this.resourceManager.keepSpritesheet("blue");
        this.resourceManager.keepAudio("jump");
        this.resourceManager.keepAudio("switch");
        this.resourceManager.keepAudio("player_death");
        this.resourceManager.keepAudio("ballon_pop");
        this.resourceManager.keepAudio("level_music");
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        //TODO: Change positions
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