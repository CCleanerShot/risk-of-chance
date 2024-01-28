"use client";

import GlobalStore from "@/common/global_store";
import { ResultsTypes } from "@/types";
import React, { useEffect, useState } from "react";

const Results = () => {
	const [finalResults, setfinalResults] = useState<ResultsTypes>(GlobalStore.getFromGlobalStore("finalResults").finalResults);

	const listenTofinalResults = () => {
		const newfinalResults = GlobalStore.getFromGlobalStore("finalResults").finalResults;
		setfinalResults(newfinalResults);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("finalResults", listenTofinalResults);
	}, []);

	return <div>{finalResults}</div>;
};

export default Results;
