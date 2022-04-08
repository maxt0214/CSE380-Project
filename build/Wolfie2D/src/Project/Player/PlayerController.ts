import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Timer, { TimerState } from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { Project_Color } from "../project_color";
import { Project_Events } from "../project_enums";
import Attack from "./AttackStates/Attack";
import Block from "./AttackStates/Block";
import Fall from "./PlayerStates/Fall";
import Grab from "./AttackStates/Grab";
import HURT from "./PlayerStates/HURT";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Skill1 from "./AttackStates/Skill1";
import Skill2 from "./AttackStates/Skill2";
import Skill3 from "./AttackStates/Skill3";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    AI = "AI"
}

export enum PlayerStates {
    //movement
    IDLE = "idle",
    WALK = "walk",
	JUMP = "jump",
    FALL = "fall",
    //attack
    ATK = "attack",
    GRAB = "grab",
    BLOCK = "block",
    SKILL1 = "skill1",
    SKILL2 = "skill2",
    SKILL3 = "skill3",
    
    HURT = "HURT",
    //Special status. (buff)
    STUN = "STUN",

    //AI states

	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    party: Project_Color;
    skills: Record<string,any>;
    //num hit this player receives. In other words, combo count for the other player
    combo: number = 0;
    //invincible timer after being hit for high combo
    invincible: boolean = false;
    protectTimer: Timer;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.party = options.color;
        this.skills = options.skills;

        this.initializePlatformer();
        this.addTweens(owner);
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        let attack = new Attack(this, this.owner, this.skills);
        this.addState(PlayerStates.ATK, attack);
        let grab = new Grab(this, this.owner, this.skills);
        this.addState(PlayerStates.GRAB, grab);
        let block = new Block(this, this.owner, this.skills);
        this.addState(PlayerStates.BLOCK, block);
        let skill1 = new Skill1(this, this.owner, this.skills);
        this.addState(PlayerStates.SKILL1, skill1);
        let skill2 = new Skill2(this, this.owner, this.skills);
        this.addState(PlayerStates.SKILL2, skill2);
        let skill3 = new Skill3(this, this.owner, this.skills);
        this.addState(PlayerStates.SKILL3, skill3);

        let hurt = new HURT(this, this.owner);
        this.addState(PlayerStates.HURT, hurt);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }
        super.changeState(stateName);
    }

    update(deltaT: number): void {
		super.update(deltaT);
        if(this.currentState instanceof Attack) {
            console.log(`${this.party} is attacking!`);
        } else if(this.currentState instanceof HURT) {
            console.log(`${this.party} is being hurt!`);
        }
        //console.log(`Invincible ${this.invincible}`);
	}

    inRange(center: Vec2, range: Vec2, state: string) {
        if(this.invincible) return false;
        let xDis = Math.abs(this.owner.position.x - center.x);
        let yDis = Math.abs(this.owner.position.y - center.y);
        console.log(`Opponent attemps to attack [${center}][${range}]. Currently at [${this.owner.position}] Distance:[${xDis},${yDis}]`);
        if(xDis <= range.x && yDis <= range.y) {
            this.changeState(state);
            return true;
        }
        return false;
    }

    addTweens(owner: GameNode) : void {
        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
        owner.tweens.add("death", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Project_Events.PLAYER_KILLED
        });
    }
}