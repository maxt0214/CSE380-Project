import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Project_Events } from "../../project_enums";
import OnGround from "../PlayerStates/OnGround";
import PlayerState from "../PlayerStates/PlayerState";
import AttackBase from "./AttackBase";

export default class Block extends AttackBase {
	owner: AnimatedSprite;

	constructor(parent: StateMachine, owner: GameNode, skills: Record<string,any>){
		super(parent, owner, skills.block);
	}

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("BLOCK", false);
		super.onEnter(options);
	}

	/*
	onHold(options: Record<string,any>): void{
		this.owner.animation.play("BLOCK_HOLD", false)
		super.onHold(options);
	}*/

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}