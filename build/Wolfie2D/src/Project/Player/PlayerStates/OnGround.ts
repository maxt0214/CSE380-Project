import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Project_Color } from "../../project_color";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		if(this.parent.party === Project_Color.RED) {
			if(Input.isJustPressed("jump1")) {
				this.finished("jump");
				this.parent.velocity.y = -500;
				if(this.parent.velocity.x !== 0){
					this.owner.tweens.play("flip");
				}
			} else if(!this.owner.onGround){
				this.finished("fall");
			} else if(Input.isJustPressed("attack1")){
				this.finished("attack");
			} else if(Input.isJustPressed("grab1")) {
				this.finished("grab");
			} else if(Input.isJustPressed("block1")) {
				this.finished("block");
			} else if(Input.isJustPressed("skill11")) {
				this.finished("skill1");
			} else if(Input.isJustPressed("skill21")) {
				this.finished("skill2");
			} else if(Input.isJustPressed("skill31")) {
				this.finished("skill3");
			}
		} else {
			if(Input.isJustPressed("jump2")) {
				this.finished("jump");
				this.parent.velocity.y = -500;
				if(this.parent.velocity.x !== 0){
					this.owner.tweens.play("flip");
				}
			} else if(!this.owner.onGround){
				this.finished("fall");
			} else if(Input.isJustPressed("attack2")){
				this.finished("attack");
			} else if(Input.isJustPressed("grab2")) {
				this.finished("grab");
			} else if(Input.isJustPressed("block2")) {
				this.finished("block");
			} else if(Input.isJustPressed("skill12")) {
				this.finished("skill1");
			} else if(Input.isJustPressed("skill22")) {
				this.finished("skill2");
			} else if(Input.isJustPressed("skill32")) {
				this.finished("skill3");
			}
		}

        if(Input.isJustPressed("cheap_invincible")) {
            this.parent.invincible = true;
            this.parent.protectTimer = Number.MAX_VALUE;
        }
	}

	onExit(): Record<string, any> {
		return {};
	}
}