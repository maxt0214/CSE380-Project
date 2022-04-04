import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Project_Events } from "../project_enums";
import EnemyController, { EnemyStates } from "./EnemyController";

export default abstract class EnemyState extends State {
	owner: GameNode;
	gravity: number = 500;
	parent: EnemyController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	handleInput(event: GameEvent): void {

	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity * deltaT;

		if (this.owner.onWall) {
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner)
				.invertX;
		}

		if (this.owner.onCeiling || this.owner.onGround) {
			if (this.gravity != 0) {
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * this.parent.ySpeed);
			}
			else{
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * MathUtils.clamp(Math.abs(this.parent.velocity.y), 0, this.parent.ySpeed));
			}
		}
	}
}
