import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../../Wolfie2D/Utils/RandUtils";
import { Project_Color } from "../../project_color";
import { PlayerStates } from "../PlayerController";
import PlayerState from "../PlayerStates/PlayerState";

//AI can only make moves when they are on ground
export default class AIOnGround extends PlayerState {
	priorities: Map<string,number>;
	weight_total: number;
	decision_timer: number;

	//Sample Options: { Attack: 2, Block: 5, Grab:6 ... } meaning attack [0,2), block [2,5), block [5,6)
	onEnter(options: Record<string, any>): void {
		this.priorities.set(PlayerStates.ATK,options.Attack);
		this.priorities.set(PlayerStates.BLOCK,options.Block);
		this.priorities.set(PlayerStates.GRAB,options.Grab);
		this.priorities.set(PlayerStates.SKILL1,options.Skill1);
		this.priorities.set(PlayerStates.SKILL2,options.skill2);
		this.priorities.set(PlayerStates.SKILL3,options.Skill3);
		this.weight_total = options.Skill3;

		this.decision_timer = 5;
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

		this.decide(deltaT);
	}

	decide(deltaT: number): void {
		if(this.decision_timer < 0) {
			let val = RandUtils.randInt(0,this.weight_total);
			for(let [key,value] of this.priorities) {
				if(val < value) {
					this.finished(key);
					break;
				}
			}
		}
		this.decision_timer -= deltaT;
	}

	onExit(): Record<string, any> {
		return {};
	}
}