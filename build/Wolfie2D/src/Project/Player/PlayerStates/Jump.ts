import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { Project_Color } from "../../project_color";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		if(this.parent.party === Project_Color.RED)
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p1jump", loop: false, holdReference: false});
		else
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "p2jump", loop: false, holdReference: false});
	}

	updateAnim() {
		this.owner.animation.play("JUMP", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}