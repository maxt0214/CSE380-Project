import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { Project_Color } from "../../project_color";
import { Project_Events } from "../../project_enums";
import PlayerController from "../PlayerController";

export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: PlayerController;
	positionTimer: Timer;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
		this.positionTimer = new Timer(250);
		this.positionTimer.start();
	}

	handleInput(event: GameEvent): void {

	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		if(this.parent.party === Project_Color.RED) {
			direction.x = (Input.isPressed("left1") ? -1 : 0) + (Input.isPressed("right1") ? 1 : 0);
			direction.y = (Input.isJustPressed("jump1") ? -1 : 0);
		} else {
			direction.x = (Input.isPressed("left2") ? -1 : 0) + (Input.isPressed("right2") ? 1 : 0);
			direction.y = (Input.isJustPressed("jump2") ? -1 : 0);
		}
		return direction;
	}

	updateAnim() {

	}

	update(deltaT: number): void {
		this.updateAnim();
		// Do gravity
		if (this.positionTimer.isStopped()){
			this.emitter.fireEvent(Project_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
			this.positionTimer.start();
		}
		this.parent.velocity.y += this.gravity*deltaT;
	}
}