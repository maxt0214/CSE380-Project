import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import GameLevel from "./GameLevel";

export default class Level1 extends GameLevel {

    loadScene(): void {
        super.loadScene();
        this.load.audio("hit", "project_assets/sounds/hit.wav");
        this.loadp1Sound(this.initOptions.p1Skillset);
        this.loadp2Sound(this.initOptions.p2Skillset);
    }

    loadp1Sound(name: string) {
        if(name.includes("fighter")) {
            this.load.audio("p1jump", "project_assets/sounds/fighter/jump.wav");
            this.load.audio("p1player_death", "project_assets/sounds/fighter/player_death.wav");
            this.load.audio("p1attack", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p1grab", "project_assets/sounds/fighter/grab.wav");
            this.load.audio("p1block", "project_assets/sounds/fighter/block.wav");
            this.load.audio("p1skill1", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p1skill2", "project_assets/sounds/fighter/skill2.wav");
            this.load.audio("p1skill3", "project_assets/sounds/fighter/skill3.wav");
        } else if(name.includes("waterlady")) {
            this.load.audio("p1jump", "project_assets/sounds/waterlady/jump.wav");
            this.load.audio("p1player_death", "project_assets/sounds/waterlady/player_death.wav");
            this.load.audio("p1attack", "project_assets/sounds/waterlady/attack.wav");
            this.load.audio("p1grab", "project_assets/sounds/waterlady/grab.wav");
            this.load.audio("p1block", "project_assets/sounds/waterlady/block.wav");
            this.load.audio("p1skill1", "project_assets/sounds/waterlady/skill1.wav");
            this.load.audio("p1skill2", "project_assets/sounds/waterlady/skill2.wav");
            this.load.audio("p1skill3", "project_assets/sounds/waterlady/skill3.wav");
        }
    }

    loadp2Sound(name: string) {
        if(name.includes("fighter")) {
            this.load.audio("p2jump", "project_assets/sounds/fighter/jump.wav");
            this.load.audio("p2player_death", "project_assets/sounds/fighter/player_death.wav");
            this.load.audio("p2attack", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p2grab", "project_assets/sounds/fighter/grab.wav");
            this.load.audio("p2block", "project_assets/sounds/fighter/block.wav");
            this.load.audio("p2skill1", "project_assets/sounds/fighter/attack.wav");
            this.load.audio("p2skill2", "project_assets/sounds/fighter/skill2.wav");
            this.load.audio("p2skill3", "project_assets/sounds/fighter/skill3.wav");
        } else if(name.includes("waterlady")) {
            this.load.audio("p2jump", "project_assets/sounds/waterlady/jump.wav");
            this.load.audio("p2player_death", "project_assets/sounds/waterlady/player_death.wav");
            this.load.audio("p2attack", "project_assets/sounds/waterlady/attack.wav");
            this.load.audio("p2grab", "project_assets/sounds/waterlady/grab.wav");
            this.load.audio("p2block", "project_assets/sounds/waterlady/block.wav");
            this.load.audio("p2skill1", "project_assets/sounds/waterlady/skill1.wav");
            this.load.audio("p2skill2", "project_assets/sounds/waterlady/skill2.wav");
            this.load.audio("p2skill3", "project_assets/sounds/waterlady/skill3.wav");
        }
    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.resourceManager.unloadAllResources();
    }

    startScene(): void {
        this.add.tilemap("level", new Vec2(2, 2));//this is loaded in loadScene in gamelevel
        //TODO: Change viewport
        this.viewport.setBounds(0, 0, 30*32, 20*32); 

        this.player1Spawn = new Vec2(5*32, 14*32);
        this.player2Spawn = new Vec2(12*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();
        
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}