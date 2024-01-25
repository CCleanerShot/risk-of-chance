import View from "@/app/components/Logic/View/View";
import ModalAuth from "./components/Logic/ModalAuth/ModalAuth";
import { Toaster } from "react-hot-toast";

export default function Home() {
	return (
		<main>
			<View />
			<ModalAuth />
			<Toaster />
		</main>
	);
}
