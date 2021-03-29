/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useLocalObservable } from "mobx-react-lite";
import type { Schema } from "@core/types";

function useSelection({ selected = [], countLimit = 0, onSelect }: Options = {}) {
	const localStore = useLocalObservable(
		(): Store => ({
			selected: {
				value: selected,
				set: function (value) {
					this.value = value;
				},
			},
		})
	);

	const getSelected = useCallback(() => {
		return localStore.selected.value;
	}, []);

	const isSelected = useCallback((id: number) => {
		return localStore.selected.value.includes(id);
	}, []);

	const isEverySelected = useCallback(
		(ids: number[]) => {
			return (
				ids.every((id) => localStore.selected.value.includes(id)) &&
				localStore.selected.value.length > 0
			);
		},
		[isSelected]
	);

	const setSelected = useCallback(
		(selected: number[]) => {
			localStore.selected.set(selected);

			if (onSelect) {
				onSelect(localStore.selected.value);
			}
		},
		[onSelect]
	);

	const unselect = useCallback(
		(id: number) => {
			const withoutTargetId = localStore.selected.value.filter(
				(selected) => id !== selected
			);
			setSelected(withoutTargetId);
		},
		[setSelected]
	);

	const select = useCallback(
		(id: number) => {
			if (isSelected(id)) {
				unselect(id);
			} else if (countLimit === 0 || countLimit > localStore.selected.value.length) {
				const withTargetId = [...localStore.selected.value, id];
				setSelected(withTargetId);
			}
		},
		[unselect, isSelected, setSelected]
	);

	const selectMany = useCallback(
		(ids: number[]) => {
			ids.forEach((id) => {
				if (isSelected(id) === false) {
					select(id);
				}
			});
		},
		[isSelected, select]
	);

	const unselectMany = useCallback(
		(ids: number[]) => {
			ids.forEach((id) => {
				if (isSelected(id) === true) {
					unselect(id);
				}
			});
		},
		[isSelected, unselect]
	);

	const optionalSelect = useCallback(
		<T extends "one" | "many">(data: {
			type: T;
			target: T extends "one" ? number : number[];
		}) => {
			if (data.type === "one") {
				if (isSelected(data.target as number)) {
					unselect(data.target as number);
				} else {
					select(data.target as number);
				}
			} else {
				if (isEverySelected(data.target as number[])) {
					unselectMany(data.target as number[]);
				} else {
					selectMany(data.target as number[]);
				}
			}
		},
		[select, unselect, selectMany, unselectMany, isSelected, isEverySelected]
	);

	useEffect(() => {
		localStore.selected.set(selected);
	}, [selected]);

	return {
		select,
		unselect,
		selectMany,
		unselectMany,
		optionalSelect,
		isSelected,
		isEverySelected,
		getSelected,
	};
}

export { useSelection };
export interface Options {
	selected?: number[];
	countLimit?: number;
	onSelect?: (selected: number[]) => void;
}

type Store = Schema.Store<{
	selected: number[];
}>;
