import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_HOST_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

export const supabase = createClient<Database>(URL, PUBLIC_KEY);

const queries = {} as const;

export default class UtilsSupabase {
	static updateSession() {}
}
