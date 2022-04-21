import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import RandUtils from "../../../Wolfie2D/Utils/RandUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "../PlayerStates/PlayerState";

//AI can only make moves when they are on ground
export default class AIOnGround extends PlayerState {
	priorities: Map<string,number> = new Map<string,number>();
	weight_total: number;
	decision_timer: number;

	constructor(parent: StateMachine, owner: GameNode, moveset: Record<string,any>){
		super(parent, owner);
		this.priorities.set(PlayerStates.ATK,moveset.Attack);
		this.priorities.set(PlayerStates.BLOCK,moveset.Block);
		this.priorities.set(PlayerStates.GRAB,moveset.Grab);
		this.priorities.set(PlayerStates.SKILL1,moveset.Skill1);
		this.priorities.set(PlayerStates.SKILL2,moveset.skill2);
		this.priorities.set(PlayerStates.SKILL3,moveset.Skill3);
		this.weight_total = moveset.Skill3;
	}

	//Sample Options: { Attack: 2, Block: 5, Grab:6 ... } meaning attack [0,2), block [2,5), block [5,6)
	onEnter(options: Record<string, any>): void {
		this.decision_timer = 2;
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

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