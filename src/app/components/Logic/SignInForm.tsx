"use client";

import React from "react";
import GlobalStore from "@/common/global_store";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const SignInForm = () => {
	const supabaseClient = GlobalStore.getFromGlobalStore("supabaseClient").supabaseClient;

	return (
		<div className="flex">
			<Auth supabaseClient={supabaseClient} providers={["google", "github"]} appearance={{ theme: ThemeSupa }}></Auth>
		</div>
	);
};

export default SignInForm;
