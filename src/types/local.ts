import { AuthError, Session } from "@supabase/supabase-js";

export type ActorTypes = "player" | "enemy";
export type GameStatusTypes = "battle" | "start" | "results" | "exit" | "shop";
export type MessageTypes = "log" | "warn" | "error";
export type ModalAuthTabTypes = "signin" | "register";
export type ModalTypes = "modalAuth" | "modalSettings";
export type ProviderTypes = "google" | "github";
export type ResultsTypes = "win" | "lose" | "draw";
export type SettingTypes = "moveItem" | "deleteItem";
export type SizeTypes = "smallest" | "small" | "medium" | "large" | "largest";
export type StatusColorTypes = "red" | "yellow" | "green";
export type StorageTypes = "backpack" | "inventory" | "battleItems" | "rewards" | "trashCan" | "shop";
export type SupabaseSessionStatusTypes = "loading" | "none" | "exists" | "valid" | "guest";

type AllItemTypes = "dice" | "health" | null;
export type Item<Type extends AllItemTypes = AllItemTypes> = Type extends null ? null : { type: Type; disabled: boolean } & (Type extends "dice" ? { sides: number } : Type extends "health" ? { healAmount: number } : {});
export type PurchaseableItem = Item & { cost: number };
// to check if database query matches the type of a backpack

export interface Alignment {
	x: "left" | "middle" | "right";
	y: "top" | "middle" | "bottom";
}

export interface NPC {
	name: string;
	items: Item<any>[];
}

export interface Game {
	gameStatus: GameStatusTypes;
	currentFloor: number;
}

export interface Health {
	current: number;
	max: number;
}

// // prettier-ignore
// export type SupabaseSession =
// { data: { session: Session }; error: null } |
// { data: { session: null }; error: AuthError } |
// { data: { session: null }; error: null };
