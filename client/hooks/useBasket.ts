/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect } from "react";
import { useStorageItem } from "./useStorageItem";
import { useAPI } from "./useAPI";
import { storeContext } from "@core/store";

import { productService } from "@core/services";

function useBasket() {
	const store = useContext(storeContext);
	const checkForAvailability = useAPI(productService.getAvailableIDArray);

	const basketLocalStorageItem = useStorageItem<{ id: number; count: number }[]>("basket", {
		storageType: "local",
		isJSONParsingEnabled: true,
	});

	const removeProduct = useCallback((id: number) => {
		const products = store.app.basket.value;

		if (products) {
			const productsWithoutTargetId = products.filter((product) => product.id !== id);
			const value = productsWithoutTargetId.length ? productsWithoutTargetId : null;

			store.app.basket.set(value);
			basketLocalStorageItem.set(value);
		}
	}, []);

	const addProduct = useCallback((product: { id: number; count: number }) => {
		let updatedBasket = [];
		const products = store.app.basket.value;

		if (product.count > 0) {
			if (products) {
				const unlinkedProducts = [...products];
				const targetProductIndex = unlinkedProducts.findIndex(({ id }) => id === product.id);

				if (targetProductIndex !== -1) {
					unlinkedProducts[targetProductIndex] = {
						...unlinkedProducts[targetProductIndex],
						...product,
					};
				} else {
					unlinkedProducts.push(product);
				}

				updatedBasket = unlinkedProducts;
			} else {
				updatedBasket = [product];
			}

			store.app.basket.set(updatedBasket);
			basketLocalStorageItem.set(updatedBasket);
		} else {
			removeProduct(product.id);
		}
	}, []);

	const getProduct = useCallback((id: number) => {
		const products = store.app.basket.value || [];

		return products.find((product) => id === product.id);
	}, []);

	const getProducts = useCallback(() => {
		return store.app.basket.value || [];
	}, []);

	const getProductCount = useCallback(() => {
		const products = store.app.basket.value || [];

		return products.length;
	}, []);

	const checkProductsForAvailability = useCallback(async () => {
		const products = store.app.basket.value;

		if (products) {
			try {
				const response = await checkForAvailability.call(products.map(({ id }) => id));

				const notAvailableProducts = products.filter(({ id }) => response.includes(id) === false);

				notAvailableProducts.forEach(({ id }) => {
					removeProduct(id);
				});
			} catch (error) {
				console.error(error);
			}
		}
	}, []);

	const reset = useCallback(() => {
		basketLocalStorageItem.set(null);
		store.app.basket.set(null);
	}, []);

	useEffect(() => {
		store.app.basket.set(basketLocalStorageItem.get());
	}, []);

	return {
		addProduct,
		getProducts,
		getProduct,
		removeProduct,
		getProductCount,
		checkProductsForAvailability,
		reset,
	};
}

export { useBasket };
