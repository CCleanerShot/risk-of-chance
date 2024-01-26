export interface NPC {
	name: string;
	items: Item[];
}

export type Item =
	| {
			type: "dice";
			sides: number;
	  }
	| {
			type: "health";
	  };

export type GameStatusTypes = { type: "battle"; turn: "player" | "enemy" } | { type: "start" } | { type: "loot" };
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
