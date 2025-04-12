import { Toaster } from "react-hot-toast";
import View from "@/app/components/Logic/View/View";
import ModalAuth from "@/app/components/Logic/ModalAuth/ModalAuth";
import ModalSettings from "@/app/components/Logic/ModalSettings/ModalSettings";
import SettingsHandler from "@/app/components/Logic/SettingsHandler/SettingsHandler";
import ModalCreateUser from "@/app/components/Logic/ModalCreateUser/ModalCreateUser";

export default function Home() {
    return (
        <main>
            <View />
            <ModalAuth />
            <ModalCreateUser />
            <ModalSettings />
            <Toaster />
            <SettingsHandler />
        </main>
    );
}

// TODO: fix infinite loading screen that happens occasionally
