import React from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";

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
					<Button onClick={handleSignIn} template="standard">
						Sign In/Sign Up
					</Button>
					<Button onClick={handleGuest} template="standard">
						Play As Guest
					</Button>
				</div>
			</div>
		</div>
	);
};

export default GetStarted;
