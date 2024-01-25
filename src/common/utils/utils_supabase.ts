import dotenv from "dotenv";
import { Session, createClient } from "@supabase/supabase-js";
import { Database, Json, ProviderTypes, SupabaseSession } from "@/types";
import GlobalStore from "../global_store";
import { Backpack, Dice, Inventory, Item, ItemDB } from "@/types/game";

const URL = process.env.NEXT_PUBLIC_SUPABASE_HOST_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

export const supabase = createClient<Database>(URL, PUBLIC_KEY);

// prettier-ignore
export const queries = {
	createUser: async (oauth_origin: string, username: string) => await supabase.from("users").insert({ oauth_origin: oauth_origin, username: username, inventory: null }),
	UpdateInventory: async (backpack: Backpack, session_id: string) => await supabase.from("users").update({ backpack: JSON.stringify(backpack) }).eq("oauth_origin", session_id),
} as const;

export default class UtilsSupabase {
	static updateSession() {}

	static SignInWithProvider(provider: ProviderTypes) {
		switch (provider) {
			case "github": {
				const queryParams = { access_type: "offline", prompt: "consent" };
				supabase.auth.signInWithOAuth({ provider: provider, options: { queryParams: queryParams } });
				break;
			}
			case "google": {
				const queryParams = { access_type: "offline", prompt: "consent" };
				supabase.auth.signInWithOAuth({ provider: provider, options: { queryParams: queryParams } });
				break;
			}
		}
	}

	static GetQuery<T extends keyof typeof queries>(query: T) {
		const item = queries[query];

		const wrapperFunction = async (params: Parameters<typeof item>) => {
			GlobalStore.UpdateVariableProperty("isLoading", "isLoading", true);

			// @ts-ignore
			const result = await item(...params);

			GlobalStore.UpdateVariableProperty("isLoading", "isLoading", false);
			return result;
		};

		return {
			callQuery: (...params: Parameters<typeof item>) => wrapperFunction(params),
		};
	}
}
