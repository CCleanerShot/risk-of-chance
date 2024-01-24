import UtilsCSS from "@/common/utils/utils_css";
import { Alignment } from "@/types";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface MovableProps {
	children: React.ReactNode;
	defaultPosition: Alignment;
	className?: string;
}

const Movable = ({ children, className, defaultPosition }: MovableProps) => {
	const [isDragged, setIsDragged] = useState(false);
	const [newPosition, setNewPosition] = useState<{ x: number; y: number } | null>(null);
	const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		setIsDragged(true);
		setStartPosition({ x: e.clientX, y: e.clientY });
	};

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		if (startPosition) {
			const [x, y] = [e.clientX, e.clientY];
			const rect = e.currentTarget.getBoundingClientRect();
			const differenceX = x - startPosition?.x;
			const differenceY = y - startPosition?.y;
			const newX = rect.left + differenceX;
			const newY = rect.top + differenceY;

			if (x !== 0 && y !== 0) {
				setStartPosition({ x: x, y: y });
				setNewPosition({ x: newX, y: newY });
			}
		}
	};

	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		setIsDragged(false);
	};

	const { left, top, transform } = UtilsCSS.returnPositionFromAlignment(defaultPosition);

	return (
		<div
			draggable
			style={newPosition ? { left: newPosition.x, top: newPosition.y } : { left: 0, top: 0, transform: `translate(${transform.x}, ${transform.y})` }}
			className={twMerge(isDragged ? "bg-green-200" : "", "fixed", className)}
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
		>
			{children}
		</div>
	);
};

export default Movable;
