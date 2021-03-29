/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useLocalObservable } from "mobx-react-lite";
import type { API, Schema, Take } from "@core/types";

function useAPI<
	F extends API.Service.Function<API.Response<any>>,
	R extends Take.FromServiceFunction.Response<F>,
	P extends Parameters<F>
>(service: F, { isPendingAfterMount = false, isIgnoreHTTPErrors = false }: Options = {}) {
	const localStore = useLocalObservable<Store>(() => ({
		isPending: {
			value: isPendingAfterMount,
			set: function (value) {
				this.value = value;
			},
		},
	}));

	const call = useCallback(
		async (...params: P): Promise<R["result"]> => {
			localStore.isPending.set(true);

			try {
				const { data } = await service(...params);
				const { result } = data;

				localStore.isPending.set(false);

				return result;
			} catch (error) {
				if (isIgnoreHTTPErrors === false) {
					console.error(error);
				}

				localStore.isPending.set(false);

				throw error;
			}
		},
		[service, isIgnoreHTTPErrors]
	);

	const isPending = useCallback(() => {
		return localStore.isPending.value;
	}, []);

	useEffect(() => {
		localStore.isPending.set(isPendingAfterMount);
	}, [isPendingAfterMount]);

	return {
		call,
		isPending,
	};
}

export { useAPI };
export interface Options {
	isPendingAfterMount?: boolean;
	isIgnoreHTTPErrors?: boolean;
}

type Store = Schema.Store<{ isPending: boolean }>;
