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
	freeTimer: Timer;

	onEnter(options: Record<string, any>): void {
		//this.owner.animation.play("HURT", false);
		this.freeTimer = new Timer(5000/this.parent.combo,() => 
		{
			this.owner.animation.stop();
			this.parent.invincible = true;
			this.parent.protectTimer = new Timer(1000,() => { this.parent.invincible = false; })
			this.finished(PlayerStates.IDLE); 
		});
	}

	onExit(): Record<string, any> {
		//this.owner.animation.stop();
		this.freeTimer.pause();
		return {};
	}
}