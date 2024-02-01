import React from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import H1 from "@/app/components/UI/H1";

const GetStarted = () => {
	const handleSignIn = () => {
		GlobalStore.Update("modalAuth", "isOpened", true);
	};

	const handleGuest = () => {
		GlobalStore.Update("supabaseSession", "status", "guest");
	};

	return (
		<div className={`flex bg-slate-700 text-white justify-center items-center p-4`}>
			<div className="flex justify-center items-center">
				<div className="flex flex-col gap-2">
					<div className="grid place-items-center p-2">
						<H1 className="text-4xl">Risk of Chance</H1>
						<span>A game of chance.</span>
					</div>
					<Button onClick={handleSignIn} template="standard">
						<strong>Sign In</strong> or <strong>Sign Up</strong>
					</Button>
					<Button onClick={handleGuest} template="standard">
						Play As <strong>Guest</strong>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default GetStarted;
