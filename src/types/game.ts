export interface NPC {
	name: string;
	items: Item<any>[];
}

type ItemTypes = "dice" | "health" | null;
export type Item<T extends ItemTypes = ItemTypes> = T extends null ? null : { type: T; disabled: boolean } & (T extends "dice" ? { sides: number } : T extends "health" ? { healAmount: number } : {});

export type GameStatusTypes = { type: "battle" } | { type: "start" } | { type: "results" };
export interface Game {
	gameStatus: GameStatusTypes;
	currentFloor: number;
}

// to check if database query matches the type of a backpack
export const backpackConst = [{ type: "dice", sides: 1 } as Item<"dice">] as Item[];
export type Backpack = typeof backpackConst;

export interface Health {
	current: number;
	max: number;
}
