"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import GlobalStore from "@/common/global_store";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const SignInForm = () => {
    const supabaseClient = GlobalStore.getFromStore("supabaseClient").supabaseClient;
    const page = process.env.ENVIRONMENT === "production" ? process.env.NEXT_PUBLIC_HOMEPAGE_PROD : process.env.NEXT_PUBLIC_HOMEPAGE_DEV;

    return (
        <div className="flex">
            <Auth supabaseClient={supabaseClient} providers={["google", "github"]} appearance={{ theme: ThemeSupa }} redirectTo={page}></Auth>
        </div>
    );
};

export default SignInForm;
