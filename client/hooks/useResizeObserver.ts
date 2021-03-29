/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useMemo } from "react";
import { useLocalObservable } from "mobx-react-lite";
import { debounce, isAPISupported, isClient } from "@core/utils";
import type { Schema } from "@core/types";

const errorMessage =
	"ResizeObserver is not supported, this could happen both because window.ResizeObserver is not supported by your current browser or you're using the useResizeObserver hook whilst server side rendering.";

function useResizeObserver<E extends HTMLElement>(
	ref: React.RefObject<E>,
	{ onResize, debounceTimeout = 100 }: Options = {}
) {
	const isSupported = useMemo(() => isAPISupported("ResizeObserver"), []);

	const observerRef = useRef(null);

	const localStore = useLocalObservable<Store>(() => ({
		DOMRect: {
			value: { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 },
			set: function (value) {
				this.value = value;
			},
		},
	}));

	if (isClient() && !isSupported) {
		console.warn(errorMessage);
	}

	const getRect = useCallback(() => {
		return localStore.DOMRect.value;
	}, []);

	const getSize = useCallback(() => {
		const { width, height } = localStore.DOMRect.value;

		return {
			width,
			height,
		};
	}, []);

	const getWidth = useCallback(() => {
		return localStore.DOMRect.value.width;
	}, []);

	const getHeight = useCallback(() => {
		return localStore.DOMRect.value.height;
	}, []);

	useEffect(() => {
		const element = ref.current;

		if (isSupported) {
			const fn = debounce((entries) => {
				const { bottom, height, left, right, top, width } = entries[0].contentRect;

				if (onResize) {
					onResize({ width, height });
				}

				localStore.DOMRect.set({ bottom, height, left, right, top, width });
			}, debounceTimeout);

			// @ts-expect-error
			observerRef.current = new ResizeObserver(fn);
		}

		return () => {
			if (isSupported && observerRef.current && element) {
				// @ts-expect-error
				observerRef.current.unobserve(element);
			}
		};
	}, [debounceTimeout, isSupported, onResize]);

	useEffect(() => {
		if (isSupported && ref.current) {
			// @ts-expect-error
			observerRef.current.observe(ref.current);
		}
	}, [isSupported, ref]);

	return { getRect, getSize, getWidth, getHeight };
}

export { useResizeObserver };
export interface Options {
	onResize?: (size: { width: number; height: number }) => void;
	debounceTimeout?: number;
}

type Store = Schema.Store<{
	DOMRect: {
		top: number;
		left: number;
		right: number;
		bottom: number;
		width: number;
		height: number;
	};
}>;
