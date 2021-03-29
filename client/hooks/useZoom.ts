/* eslint-disable react-hooks/exhaustive-deps */
import { useLocalObservable } from "mobx-react-lite";
import { useCallback } from "react";
import { useThrottledFN } from "./useThrottledFN";
import type { Schema } from "@core/types";

function useZoom<E extends HTMLElement>(
	ref: React.RefObject<E>,
	{ framesPerSecond = 60 }: Options
) {
	const localStore = useLocalObservable<Store>(() => ({
		isFocused: {
			value: false,
			set: function (value) {
				this.value = value;
			},
		},
		position: {
			value: {
				x: 0,
				y: 0,
			},
			set: function (value) {
				this.value = value;
			},
		},
	}));

	const handleMouseMove = useThrottledFN(
		(event) => {
			if (localStore.isFocused.value && ref.current) {
				event.stopPropagation();

				const { x, y, width, height } = ref.current.getBoundingClientRect();
				const localPosition = {
					x: event.clientX - x,
					y: event.clientY - y,
				};

				localStore.position.set({
					x: (localPosition.x / width) * 100,
					y: (localPosition.y / height) * 100,
				});
			}
		},
		1000 / framesPerSecond,
		[ref.current, framesPerSecond]
	);

	const handleMouseOver = useCallback((event) => {
		event.stopPropagation();
		localStore.isFocused.set(true);
	}, []);

	const handleMouseLeave = useCallback((event) => {
		event.stopPropagation();
		localStore.isFocused.set(false);
	}, []);

	const isFocused = useCallback(() => {
		return localStore.isFocused.value;
	}, []);

	const getPosition = useCallback(() => {
		return localStore.position.value;
	}, []);

	return {
		handleMouseMove,
		handleMouseOver,
		handleMouseLeave,
		isFocused,
		getPosition,
	};
}

export { useZoom };
export interface Options {
	framesPerSecond?: number;
}

type Store = Schema.Store<{
	position: { x: number; y: number };
	isFocused: boolean;
}>;
