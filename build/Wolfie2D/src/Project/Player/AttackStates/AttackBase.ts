import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { Project_Events } from "../../project_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "../PlayerStates/OnGround";
import PlayerState from "../PlayerStates/PlayerState";

export default class AttackBase extends PlayerState {
	owner: AnimatedSprite;
	damage: number;
	range: Vec2;
	buffState: string;
	cdTime: number;
	timer: number;
	projectile: string;

	constructor(parent: StateMachine, owner: GameNode, skill: Record<string,any>){
		super(parent, owner);
		this.damage = skill.dmg;
		this.range = new Vec2(skill.range.x, skill.range.y);
		this.buffState = skill.state;
		this.projectile = skill.projectile;
		this.cdTime = skill.timer * 1;
	}

	onEnter(options: Record<string, any>): void {
		this.timer = this.cdTime;
		if(this.projectile === "")
			this.close_range();
		else
			this.long_range();
	}

	update(deltaT: number): void {
		super.update(deltaT);
		this.timer -= deltaT;
		if(this.timer < 0)
			this.finished(PlayerStates.IDLE);
	}

	onExit(): Record<string, any> {
		return {};
	}

	close_range():void {
		//Send play attack evemt with damage info, center of attack will be offset to the front of player
		let offset = new Vec2(this.owner.invertX ? -1 : 1, 0);
		this.emitter.fireEvent(Project_Events.PLAYER_ATTACK, 
		{
			party: this.parent.party, 
			dmg: this.damage, 
			center: this.owner.position.clone().add(offset),
			range: this.range.clone(),
			state: this.buffState, //state the enemy will enter after hit. This is essentially buff
			dir: offset.x
		});
	}

	long_range():void {
		//deal with projectile
		let offset = new Vec2(this.owner.invertX ? -1 : 1, 0);
		this.emitter.fireEvent(Project_Events.FIRE_PROJECTILE, 
		{
			party: this.parent.party,
			center: this.owner.position.clone().add(offset),
			dir: offset,
			projectile: this.projectile
		});
	}
}