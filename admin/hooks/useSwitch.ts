/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useLocalObservable } from "mobx-react-lite";
import type { Schema } from "@core/types";

function useSwitch<P extends string>({ sections }: Options<P>) {
	const prepareSections = useCallback((): [P, string][] => {
		return sections.map((target) => {
			const arr: [P, string] = ["" as P, ""];

			if (Array.isArray(target)) {
				arr[0] = target[0];
				arr[1] = target[1];
			} else {
				arr[0] = target;
				arr[1] = "";
			}

			return arr;
		});
	}, [sections]);

	const localStore = useLocalObservable(
		(): Store<P> => ({
			sections: {
				value: prepareSections(),
				set: function (value) {
					this.value = value;
				},
			},
		})
	);

	const get = useCallback((name: P) => {
		const target = localStore.sections.value.find(
			([paramName]) => paramName === name
		);

		return target ? target[1] : "";
	}, []);

	const set = useCallback((name: P, value: string) => {
		const updated = localStore.sections.value.map(([paramName, paramValue]) => {
			if (paramName === name) {
				return [paramName, value];
			}
			return [paramName, paramValue];
		}) as [P, string][];
		localStore.sections.set(updated);
	}, []);

	useEffect(() => {
		prepareSections()
			.filter(([, sectionCode]) => sectionCode)
			.forEach(([sectionName, sectionValue]) => set(sectionName, sectionValue));
	}, [prepareSections]);

	return { get, set };
}

export { useSwitch };
export interface Options<P> {
	sections: (P | [name: P, initialValue: string])[];
}

type Store<P> = Schema.Store<{
	sections: [P, string][];
}>;
