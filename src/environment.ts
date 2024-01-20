declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENVIRONMENT: "development" | "production";
			SUPABASE_REFERENCE_ID: string;
			SUPABASE_HOST_PORT: string;
			SUPABASE_CONNECTION_STRING: string;
			NEXT_PUBLIC_SUPABASE_HOST_URL: string;
			NEXT_PUBLIC_SUPABASE_PUBLIC_KEY: string;
		}
	}
}

export {};
