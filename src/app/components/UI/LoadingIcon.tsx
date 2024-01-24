import React from "react";
import { Keyframes } from "./Keyframes";

interface LoadingIconProps {
	size: number;
	color: string;
	durationMillseconds: number;
}

const LoadingIcon = ({ color, size, durationMillseconds }: LoadingIconProps) => {
	const _transparent = `${size}px solid transparent`;
	const _color = `${size}px solid ${color}`;
	const percent_0: React.CSSProperties = { borderTop: _color, borderRight: _transparent, borderBottom: _transparent, borderLeft: _transparent };
	const percent_25: React.CSSProperties = { borderTop: _transparent, borderRight: _color, borderBottom: _transparent, borderLeft: _transparent };
	const percent_50: React.CSSProperties = { borderTop: _transparent, borderRight: _transparent, borderBottom: _color, borderLeft: _transparent };
	const percent_75: React.CSSProperties = { borderTop: _transparent, borderRight: _transparent, borderBottom: _transparent, borderLeft: _color };
	const percent_100: React.CSSProperties = { borderTop: _color, borderRight: _transparent, borderBottom: _transparent, borderLeft: _transparent };

	return (
		<div className="grid place-items-center">
			<Keyframes name="loading-icon-animate" _0={percent_0} _25={percent_25} _50={percent_50} _75={percent_75} _100={percent_100} />
			<div style={{ animationName: "loading-icon-animate", animationDirection: "normal", animationDuration: `${durationMillseconds}ms`, animationIterationCount: "infinite" }}></div>
		</div>
	);
};

export default LoadingIcon;
