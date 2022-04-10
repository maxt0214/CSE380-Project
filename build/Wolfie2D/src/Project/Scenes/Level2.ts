import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Project_Color } from "../project_color";
import GameLevel from "./GameLevel";

export default class Level2 extends GameLevel {
    loadScene(): void {
        // Load resources
        this.load.tilemap("level2", "project_assets/tilemaps/level2.json");
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level2", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.player1Spawn = new Vec2(5*32, 14*32);
        this.player2Spawn = new Vec2(7*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}