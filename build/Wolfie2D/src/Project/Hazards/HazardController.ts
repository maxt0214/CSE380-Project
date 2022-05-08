import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Receiver from "../../Wolfie2D/Events/Receiver";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer, { TimerState } from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import { Project_Color } from "../project_color";
import { Project_Events } from "../project_enums";

export default class HazardController {
    party: Project_Color = Project_Color.GREEN;
    level: string;
    timer: number = 10;
    emitter: Emitter;

    beach_harzards: Vec2[] = [new Vec2(96, 288), new Vec2(288, 288), new Vec2(448, 320), new Vec2(640, 288), new Vec2(832, 320), new Vec2(1024, 288)];
    undersea_hazards: Vec2[] = [new Vec2(0, 448), new Vec2(1088, 448)];
    city_hazard: Vec2 = new Vec2(960, 512);

    constructor(stage: string) {
        if(stage.includes("beach"))
            this.level = "beach";
        else if(stage.includes("cityscape"))
            this.level = "city";
        else if(stage.includes("undersea"))
            this.level = "undersea";
        this.emitter = new Emitter();
    }

    update(deltaT: number): void {
        this.timer -= deltaT;
        if(this.timer > 0) return;

        switch(this.level) {
            case "beach":
                this.update_beach();
                break;
            case "undersea":
                this.update_undersea();
                break;
            case "cityscape":
                this.update_city();
                break;
        }
    }

    update_beach() {
        //get a random position
        let idx = RandUtils.randInt(0, this.beach_harzards.length);
        this.emitter.fireEvent(Project_Events.FIRE_PROJECTILE, 
        {
            name: "coconut",
            party: this.party,
            center: this.beach_harzards[idx],
            dir: new Vec2(0,1),
            projectile: "coconut"
        });
        this.timer = 2;
    }

    update_undersea() {
        let idx = RandUtils.randInt(0, 2);
        let dir = idx === 0 ? new Vec2(1,0) : new Vec2(-1,0);
        this.emitter.fireEvent(Project_Events.FIRE_PROJECTILE, 
        {
            name: "swirl",
            party: this.party,
            center: this.undersea_hazards[idx],
            dir: dir,
            projectile: "swirl"
        });
        this.timer = 5;
    }

    update_city() {
        this.emitter.fireEvent(Project_Events.FIRE_PROJECTILE, 
        {
            name: "car_hazard",
            party: this.party,
            center: this.city_hazard,
            dir: new Vec2(-1,0),
            projectile: "car_hazard"
        });
        this.timer = 8;
    }
}