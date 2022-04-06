import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Project_Events } from "../../project_enums";
import OnGround from "../PlayerStates/OnGround";
import PlayerState from "../PlayerStates/PlayerState";
import AttackBase from "./AttackBase";

export default class Skill3 extends AttackBase {
	owner: AnimatedSprite;

	constructor(parent: StateMachine, owner: GameNode, skills: Record<string,any>){
		super(parent, owner, skills.skill3);
	}

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("Skill3", false, Project_Events.PLAYER_ATTACK_OVER);
		super.onEnter(options);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}