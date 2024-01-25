export interface NPC {
	name: string;
	items: Item[];
}

export interface Item {
	type: string;
}

export interface ItemDB extends Item {
	id: number;
}

export class Dice implements Item {
	type: "dice";
	sides: number;

	constructor(sides: number) {
		this.type = "dice";
		this.sides = sides;
	}
}

export class DiceDB extends Dice {
	id: number;

	constructor(sides: number, id: number) {
		super(sides);
		this.id = id;
	}
}

export type Inventory = [Dice, Dice, Dice, Dice, Dice, Dice, Dice, Dice, Dice];

export type GameStatusTypes = { type: "battle"; turn: NPC } | { type: "start" } | { type: "loot" };
export interface Game {
	player: NPC;
	gameStatus: GameStatusTypes;
}

// to check if database query matches the type of a backpack
export const backpackConst = [{ type: "dice" } as Item] as Item[];
export type Backpack = typeof backpackConst;
