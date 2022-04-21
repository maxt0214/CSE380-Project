import AIOnGround from "./AIOnGround";

//This is a basic AI State that moves 
export default class AIIDLE extends AIOnGround {
	onEnter(options: Record<string, any>): void {
		super.onEnter(options);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		this.parent.velocity.x = 0;
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		return super.onExit();
	}
}