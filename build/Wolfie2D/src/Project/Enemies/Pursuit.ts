import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Project_Events } from "../project_enums";
import EnemyState from "./EnemyState";

export default class Pursuit extends EnemyState {
	player: Vec2;

	onEnter(): void {
        this.gravity = 0;
		this.player = new Vec2(0,0);
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
		
		this.parent.velocity.x = (this.owner.position.distanceTo(this.player) < 11) ? this.parent.direction.x * this.parent.speed * 2 : this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	handleInput(event: GameEvent): void {
		super.handleInput(event);

		if(event.type == Project_Events.PLAYER_MOVE) {
			this.player = event.data.get("position");
		}
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}