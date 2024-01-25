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
export type StorageTypes = "backpack" | "inventory" | "battle_items";
export type Opposite<Type1, Type2, Chosen> = Chosen extends Type1 ? Type1 : Type2;

// // prettier-ignore
// export type SupabaseSession =
// { data: { session: Session }; error: null } |
// { data: { session: null }; error: AuthError } |
// { data: { session: null }; error: null };
