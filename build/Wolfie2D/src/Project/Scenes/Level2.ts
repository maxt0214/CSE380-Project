import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel {

    loadScene(): void {
        super.loadScene();
        // Load common resources
        this.load.audio("jump", "project_assets/sounds/jump.wav");
        this.load.audio("player_death", "project_assets/sounds/player_death.wav");
        this.load.audio("hit", "project_assets/sounds/hit.wav");

        // player 1 attack sounds
        this.load.audio("p1attack", "project_assets/sounds/attack.wav");
        this.load.audio("p1grab", "project_assets/sounds/grab.wav");
        this.load.audio("p1block", "project_assets/sounds/block.wav");
        this.load.audio("p1skill1", "project_assets/sounds/attack.wav");
        this.load.audio("p1skill2", "project_assets/sounds/skill2.wav");
        this.load.audio("p1skill3", "project_assets/sounds/skill3.wav");

        // player 2 attack sounds
        this.load.audio("p2attack", "project_assets/sounds/attack.wav");
        this.load.audio("p2grab", "project_assets/sounds/grab.wav");
        this.load.audio("p2block", "project_assets/sounds/block.wav");
        this.load.audio("p2skill1", "project_assets/sounds/attack.wav");
        this.load.audio("p2skill2", "project_assets/sounds/skill2.wav");
        this.load.audio("p2skill3", "project_assets/sounds/skill3.wav");


        this.load.spritesheet("red", "project_assets/spritesheets/redBalloon.json");

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
        this.player2Spawn = new Vec2(12*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();

        // add stage hazards:   
        for(let pos of [new Vec2(18, 10), new Vec2(3, 13), new Vec2(8, 15)]){
            this.addHazard("red", pos, {party: Project_Color.GREEN, center: 0, dir: 0, projectile: "fireball"});         //sprite key (above), position, aiOptions (party, center, direction, projectile)
        }

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}