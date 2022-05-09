import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import RandUtils from "../../../Wolfie2D/Utils/RandUtils";
import { PlayerStates } from "../PlayerController";
import AIOnGround from "./AIOnGround";

//This is a basic AI State that moves 
export default class AIIDLE extends AIOnGround {
	move_timer: number;
	move_time: number;

	constructor(parent: StateMachine, owner: GameNode, moveset: Record<string,any>){
		super(parent, owner, moveset);
		this.move_timer = 0.5;
		this.move_time = this.move_timer;
	}
	
	onEnter(options: Record<string, any>): void {
		super.onEnter(options);
	}

	update(deltaT: number): void {
		if(!this.owner.onGround) {
			this.finished(PlayerStates.FALL);
			return;
		}

		if(this.move_time > 0) {
			if(RandUtils.randInt(0,100) < 1) {
				this.finished("jump");
				this.parent.velocity.y = -500;
				//if(this.parent.velocity.x !== 0){
					//this.owner.tweens.play("flip");
				//}
			} else {
				super.update(deltaT);
				this.move();
				this.owner.move(this.parent.velocity.scaled(deltaT));
			}
		} else {
			this.decide();
			this.move_time = this.move_timer;
		}

		this.move_time -= deltaT;
	}

	move(): void {
		let distance = this.owner.position.distanceTo(this.parent.other_player.position);
		if(distance < 30) {
			this.parent.velocity.x = 0;
		} else if(distance < 200) {
			this.parent.velocity.x = this.owner.invertX ? -this.parent.speed : this.parent.speed;
		} else {
			this.parent.velocity.x = RandUtils.randInt(-this.parent.MAX_SPEED,this.parent.MAX_SPEED);
		}
	}

	updateAnim() {
		this.owner.animation.playIfNotAlready("IDLE", true);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return super.onExit();
	}
}