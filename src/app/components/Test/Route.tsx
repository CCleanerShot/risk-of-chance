"use client";

import React, { useState } from "react";

interface Props {
	keyString: string;
	routeFunction: (args: any) => any;
}
const Route = ({ keyString, routeFunction }: Props) => {
	const [status, setStatus] = useState<"PENDING" | "PASS" | "FAIL">("PENDING");
	const [params1, setParams1] = useState("");
	const [params2, setParams2] = useState("");
	const [params3, setParams3] = useState("");
	const [params4, setParams4] = useState("");
	const [results, setResults] = useState("");

	const paramsArray = [params1, params2, params3, params4];
	const handleClick = () => {};

	const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParams1(e.target.value);
	};

	const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParams2(e.target.value);
	};

	const handleChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParams3(e.target.value);
	};

	const handleChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParams4(e.target.value);
	};

	const submitRoute = async () => {
		let result: { data: any; status: number };
		if (routeFunction.length > 1) {
			const params = Array.from({ length: routeFunction.length })
				.fill(null)
				.map((i, index) => paramsArray[index]);
			result = await (routeFunction as (...args: any) => any)(...params);
		} else {
			result = await routeFunction(params1);
		}

		setResults(JSON.stringify(result));

		if (result.status === 200 && result.data) {
			if (result.data) {
				setStatus("PASS");
			} else {
				setStatus("FAIL");
			}
			return;
		}

		if (result.status === 201) {
			setStatus("PASS");
			return;
		}

		if (result.status === 400) {
			setStatus("FAIL");
			return;
		}
	};

	const stringFunction = routeFunction.toString();
	const regexParams = (stringFunction.match(/(\(.+\))=>/) as any)?.[1] as string;
	let finalSplit: null | string[];

	if (regexParams?.length && regexParams?.length !== 0) {
		finalSplit = regexParams.replace(")", "").replace("(", "").replace("{", "").replace("}", "").split(",");
	}

	return (
		<div className="flex border border-black rounded-xl hover:bg-green-100" onClick={handleClick}>
			<div className={`font-bold px-2 border-black ${status === "PENDING" ? "bg-gray-400" : status === "PASS" ? "bg-green-400" : status === "FAIL" ? "bg-red-400" : ""} `}>
				<div>Status:</div>
				<div>{status}</div>
			</div>
			<div className="w-60 text-center self-center border-r-2 h-full border-black">{keyString}-</div>
			{Array.from({ length: routeFunction.length })
				.fill(null)
				.map((i, index) => (
					<input type="text" onChange={index === 0 ? handleChange1 : index === 1 ? handleChange2 : index === 2 ? handleChange3 : index === 3 ? handleChange4 : () => {}} className="w-28 border-l-2" placeholder={`${finalSplit?.[index] ?? ""}`} key={`${keyString} function ${index}`} />
				))}
			<button className="font-bold bg-green-400 p-2 transition hover:translate-x-1" onClick={submitRoute}>
				Submit
			</button>
			<div>{results}</div>
		</div>
	);
};

export default Route;
