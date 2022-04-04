import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { Project_Events } from "../project_enums";
import Reatreat from "./Retreat";
import Attack from "./Attack";
import Pursuit from "./Pursuit";

export enum EnemyStates {
	Reatreat = "retreat",
	Attack = "attack",
	Pursuit = "pursuit",
}

export default class EnemyController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 100;
	ySpeed: number = 700;
	gravity: number = 1000;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(Project_Events.PLAYER_MOVE);

		let retreat = new Reatreat(this, owner);
		this.addState(EnemyStates.Reatreat, retreat);
		let attack = new Attack(this, owner);
		this.addState(EnemyStates.Attack, attack);
		let pursuit = new Pursuit(this, owner);
		this.addState(EnemyStates.Pursuit, pursuit);
		
		this.direction = new Vec2(-1, 0);

		this.initialize(EnemyStates.Reatreat);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}