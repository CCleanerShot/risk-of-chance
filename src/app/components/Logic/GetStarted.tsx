import React from "react";
import Container from "@/app/components/UI/Container";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";

const GetStarted = () => {
	const handleRegister = () => {
		GlobalStore.UpdateVariableProperty("modalAuth", "isOpened", true);
		GlobalStore.UpdateVariableProperty("modalAuth", "tab", "register");
	};
	const handleSignIn = () => {
		GlobalStore.UpdateVariableProperty("modalAuth", "isOpened", true);
		GlobalStore.UpdateVariableProperty("modalAuth", "tab", "signin");
	};

	const handleGuest = () => {
		GlobalStore.UpdateVariableProperty("supabaseSession", "status", "guest");
		GlobalStore.UpdateVariableProperty("statusColor", "statusColor", "yellow");
	};

	return (
		<div className={`flex bg-slate-700 text-white justify-center items-center`}>
			<Container template="standard">
				<div className="flex justify-center items-center">
					<div className="flex flex-col gap-2">
						<Button onClick={handleSignIn} template="standard">
							Sign In
						</Button>
						<Button onClick={handleRegister} template="standard">
							Register
						</Button>
						<Button onClick={handleGuest} template="standard">
							Play As Guest
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default GetStarted;
