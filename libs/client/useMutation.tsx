import { useState } from "react";

export default function useMutation(
	url: string
): [
	(data?: any) => void,
	{ loading: boolean; data: undefined | any; error: undefined | any }
] {
	const [state, setState] = useState({
		loading: false,
		data: undefined,
		error: undefined,
	});
	function mutation(data?: any) {
		setState((prev) => ({ ...prev, loading: true }));
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json().catch(() => {}))
			.then((data) => setState((prev) => ({ ...prev, data })))
			.catch((error) => setState((prev) => ({ ...prev, error })))
			.finally(() => setState((prev) => ({ ...prev, loading: false })));
	}
	return [mutation, { ...state }];
}
