import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Project_Color } from "../../project_color";
import PlayerState from "../PlayerStates/PlayerState";

//AI can only make moves when they are on ground
export default class AIOnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {
		
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		
	}

	onExit(): Record<string, any> {
		return {};
	}
}