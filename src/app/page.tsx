import View from "@/app/components/Logic/View/View";
import ModalAuth from "@/app/components/Logic/ModalAuth/ModalAuth";
import ModalSettings from "@/app/components/Logic/ModalSettings/ModalSettings";
import { Toaster } from "react-hot-toast";
import SettingsHandler from "./components/Logic/SettingsHandler/SettingsHandler";

export default function Home() {
	return (
		<main>
			<View />
			<ModalAuth />
			<ModalSettings />
			<Toaster />
			<SettingsHandler />
		</main>
	);
}

// TODO: fix infinite loading screen that happens occasionally
