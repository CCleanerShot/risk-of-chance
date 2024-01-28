export interface NPC {
	name: string;
	items: Item[];
}

export type Item =
	| {
			type: "dice";
			disabled: boolean;
			sides: number;
	  }
	| {
			type: "health";
			disabled: boolean;
	  }
	| null;

export type GameStatusTypes = { type: "battle" } | { type: "start" } | { type: "results" };
export interface Game {
	gameStatus: GameStatusTypes;
	currentFloor: number;
}

// to check if database query matches the type of a backpack
export const backpackConst = [{ type: "dice", sides: 1 }] as Item[];
export type Backpack = typeof backpackConst;

export interface Health {
	current: number;
	max: number;
}
