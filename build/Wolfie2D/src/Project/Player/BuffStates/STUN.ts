import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import HURT from "../PlayerStates/HURT";

export default class STUN extends HURT {
	grabTime: number;

	onEnter(options: Record<string, any>): void {
		super.onEnter(options);
		//maybe add some animation above character for stun
		this.grabTime = this.freeTimer;
		this.freeTimer *= 1.4;
	}

	update(deltaT: number): void {
		if(this.freeTimer <= this.grabTime) {
			super.update(deltaT);
		} else {
			super.updateFreeTimer(deltaT);
			this.owner.move(new Vec2(-this.dir*deltaT,0));
		}
	}

	onExit(): Record<string, any> {
		return super.onExit();
	}
}