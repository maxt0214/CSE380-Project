import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Project_Events } from "../../project_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class HURT extends PlayerState {
	owner: AnimatedSprite;
	freeTimer: number;
	dir: number;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("HURT", false);
		this.freeTimer = 2/ (this.parent.combo < 1 ? 1 : this.parent.combo);
		//flip player towards the attack direction
		this.dir = this.parent.attDir;
		this.owner.invertX = this.dir === -1 ? false : true;
		this.parent.velocity.x = this.dir * 130;
		this.parent.velocity.y = -400;
		
		console.log(`Hurting after ${this.freeTimer} seconds Moving Towards:${this.dir}`);
	}

	update(deltaT: number): void {
		super.update(deltaT);
		this.freeTimer -= deltaT;
		this.parent.invincible = true
		if(this.freeTimer <= 0) {
			this.parent.invincible = true;
			this.finished(PlayerStates.IDLE);
		}

		if(this.dir === 1) {
			this.parent.velocity.x = Math.max(this.parent.velocity.x-2,0);
		} else {
			this.parent.velocity.x = Math.min(this.parent.velocity.x+2,0);
		}
		console.log(`Player Velocity:${this.parent.velocity} Moving step:${this.parent.velocity.scaled(deltaT)}`);
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}