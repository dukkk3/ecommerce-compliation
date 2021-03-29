/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext } from "react";
import { storeContext } from "@core/store";

function useNotifications() {
	const store = useContext(storeContext);

	const remove = useCallback((id: number) => {
		const notificationsWithoutTarget = store.application.notifications.value.filter(
			({ id: notificationId }) => notificationId !== id
		);
		store.application.notifications.set(notificationsWithoutTarget);
	}, []);

	const create = useCallback(
		({
			type,
			message,
			time = 0,
		}: {
			type: "success" | "warning" | "error";
			message: string;
			time?: number;
		}) => {
			const id = new Date().getTime();
			const timeout = time > 0 ? setTimeout(() => remove(id), time) : null;
			const notification = { type, message, id, timeout };
			store.application.notifications.set([
				...store.application.notifications.value,
				notification,
			]);

			return id;
		},
		[remove]
	);

	const getAll = useCallback(() => {
		return store.application.notifications.value;
	}, []);

	return { create, remove, getAll };
}

export { useNotifications };
