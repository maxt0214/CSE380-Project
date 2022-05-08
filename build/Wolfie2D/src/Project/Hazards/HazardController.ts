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
import { Project_Color } from "../project_color";
import { Project_Events } from "../project_enums";

export default class HazardController implements AI {
    protected owner: AnimatedSprite;
    protected name: string;
    
    party: Project_Color;

    public dir: Vec2;
    protected paused: boolean = false;

    dmg: number;
    buff: string;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(options.propInfo.range.x, options.propInfo.range.y)));
        this.name = options.name;
        
        this.party = options.party;
        this.dir = options.dir;

        //this.owner.animation.play("MOVE",true);
        console.log(`Spawning Prop: ${this.name} at ${this.owner.position} Party[${this.party}]`);
    }

    destroy(): void {
    }

    activate(options: Record<string, any>): void {
    }

    handleEvent(event: GameEvent): void {
    }

    update(deltaT: number): void {
        if(this.owner.visible && !this.paused) {
            //a
        }
        if(this.owner.frozen){       //pause handling
            this.paused = true;
        } else if(this.paused){
            this.paused = false;
        }
    }
}