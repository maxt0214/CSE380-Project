import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import AIOnGround from "./AIOnGround";

//This is a basic AI State that moves 
export default class AIIDLE extends AIOnGround {
	owner: AnimatedSprite;
	
	onEnter(options: Record<string, any>): void {
		super.onEnter(options);
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0 && !this.owner.onGround) {
			this.finished(PlayerStates.FALL);
		}
		super.update(deltaT);

		this.parent.velocity.x = 0;
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	updateAnim() {
		this.owner.animation.playIfNotAlready("IDLE", true);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return super.onExit();
	}
}