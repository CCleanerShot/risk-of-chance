declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: "development" | "production";
            SUPABASE_REFERENCE_ID: string;
            SUPABASE_HOST_PORT: string;
            SUPABASE_CONNECTION_STRING: string;
            NEXT_PUBLIC_SUPABASE_HOST_URL: string;
            NEXT_PUBLIC_SUPABASE_PUBLIC_KEY: string;
            NEXT_PUBLIC_HOMEPAGE_DEV: string;
            NEXT_PUBLIC_HOMEPAGE_PROD: string;
            NEXT_PUBLIC_ENVIRONMENT: "development" | "production";
        }
    }
}

export {};
