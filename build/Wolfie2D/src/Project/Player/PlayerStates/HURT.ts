import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { Project_Events } from "../../project_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class HURT extends PlayerState {
	owner: AnimatedSprite;
	freeTimer: number;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("HURT", false);
		this.freeTimer = 5/ (this.parent.combo < 1 ? 1 : this.parent.combo);
		console.log(`Hurting after ${this.freeTimer} seconds`);
	}

	update(deltaT: number): void {
		super.update(deltaT);
		this.freeTimer -= deltaT;
		this.parent.invincible = true
		if(this.freeTimer <= 0) {
			this.parent.invincible = true;
			this.finished(PlayerStates.IDLE);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}