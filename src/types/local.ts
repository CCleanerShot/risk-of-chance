import { AuthError, Session } from "@supabase/supabase-js";

export interface Alignment {
	x: "left" | "middle" | "right";
	y: "top" | "middle" | "bottom";
}

export type ModalAuthTabTypes = "signin" | "register";
export type ModalTypes = "modalAuth";
export type ProviderTypes = "google" | "github";
export type SizeTypes = "smallest" | "small" | "medium" | "large" | "largest";
export type StatusColorTypes = "red" | "yellow" | "green";
export type SupabaseSessionStatusTypes = "loading" | "none" | "exists" | "valid" | "guest";
export type MessageTypes = "log" | "warn" | "error";
export type ResultsTypes = "win" | "lose" | "draw";
export type StorageTypes = "backpack" | "inventory" | "battleItems" | "rewards";
export type ActorTypes = "player" | "enemy";

// // prettier-ignore
// export type SupabaseSession =
// { data: { session: Session }; error: null } |
// { data: { session: null }; error: AuthError } |
// { data: { session: null }; error: null };
