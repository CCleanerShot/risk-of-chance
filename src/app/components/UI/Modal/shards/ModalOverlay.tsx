import React from "react";

interface ModalOverlayProps {
	children: React.ReactNode;
}
const ModalOverlay = ({ children }: ModalOverlayProps) => {
	return <div className="fixed h-screen w-screen bg-slate-900/10 backdrop-blur-md inset-0">{children}</div>;
};

export default ModalOverlay;
