import React, { useCallback } from "react";
import { useForm, useSelection, useSimpleStore } from "@core/hooks";
import { Observer } from "mobx-react-lite";

import { ImageList, TransformedImages } from "@containers/ImageList";
import { ProductTable } from "@containers/ProductTable";

import { Switch } from "@components/smart/Switch";

import { Upsert } from "@components/smart/Upsert";
import { Field } from "@components/ordinary/Field";
import { CodeField } from "@components/ordinary/CodeField";
import { List } from "@components/ordinary/List";
import { Suspense } from "@components/ordinary/Suspense";

import { Section } from "@components/simple/Section";
import { Container } from "@components/simple/Container";

import { routesConfig } from "@core/config";
import { transformImages } from "@core/utils";
import { brandService } from "@core/services";
import { formSchemes } from "@core/schemes";

import type { Take } from "@core/types";

const BrandUpsert = ({ id = 0, isEditable = false }: Props) => {
	const form = useForm({ schema: formSchemes.brand });
	const images = useSimpleStore<TransformedImages>({ initialData: [] });
	const productSelection = useSelection();

	const handleGetData = useCallback(
		(data: Take.FromServiceFunction.ResponseModel<typeof brandService["findOneByID"]>) => {
			if (!data) {
				return;
			}

			form.setValues({
				name: data.name || "",
				code: data.code || "",
				description: data.info?.description || "",
				seoTitle: data.seo?.title || "",
				seoDescription: data.seo?.description,
				seoKeywords: data.seo?.keywords || "",
			});

			if (data.image) {
				const transformedImage = transformImages([data.image]);
				images.set(transformedImage);
			}

			productSelection.selectMany(data.products.map(({ id }) => id));
		},
		[form, productSelection, images]
	);

	const handleDataValidate = useCallback(() => {
		return {
			...form.getValues(),
			imageId: images.get()[0]?.id || null,
			productsId: productSelection.getSelected(),
		};
	}, [form, images, productSelection]);

	const handleImageChange = useCallback(
		(updatedImages: TransformedImages) => {
			images.set(updatedImages);
		},
		[images]
	);

	return (
		<Upsert
			id={id}
			isEditable={isEditable}
			readService={brandService.findOneByID}
			createService={brandService.create}
			updateService={brandService.update}
			removeService={brandService.remove}
			URLOnSuccessfulCreation={routesConfig.brandBrowserRoutes.edit}
			URLOnSuccessfulRemove={routesConfig.brandBrowserRoutes.main}
			URLOnUnsuccessfulDataRetrieval={routesConfig.brandBrowserRoutes.main}
			// @ts-expect-error
			onDataValidate={handleDataValidate}
			onGetData={handleGetData}>
			{(crud) => (
				<Switch
					sections={[
						{ code: "form", name: "Основная информация" },
						{ code: "images", name: "Изображение" },
						{ code: "products", name: "Товары" },
					]}>
					{(props) => (
						<>
							<Section {...props.form}>
								<Observer>
									{() => (
										<Suspense isWaiting={crud.isSomePending()}>
											<Container>
												<List>
													<Observer>{() => <Field {...form.bindField("name")} />}</Observer>
													<Observer>{() => <Field {...form.bindField("code")} />}</Observer>
													<Observer>{() => <CodeField {...form.bindField("name").props} />}</Observer>
													<Observer>{() => <Field {...form.bindField("description")} />}</Observer>
													<Observer>{() => <Field {...form.bindField("seoTitle")} />}</Observer>
													<Observer>{() => <Field {...form.bindField("seoKeywords")} />}</Observer>
													<Observer>{() => <Field {...form.bindField("seoDescription")} />}</Observer>
												</List>
											</Container>
										</Suspense>
									)}
								</Observer>
							</Section>
							<Section {...props.images}>
								<Observer>
									{() => (
										<Suspense isWaiting={crud.isSomePending()}>
											<ImageList
												images={images.get()}
												imageCountLimit={1}
												onChange={handleImageChange}
											/>
										</Suspense>
									)}
								</Observer>
							</Section>
							<Section {...props.products}>
								<Observer>
									{() => (
										<Suspense isWaiting={crud.isSomePending()}>
											<ProductTable selection={productSelection} />
										</Suspense>
									)}
								</Observer>
							</Section>
						</>
					)}
				</Switch>
			)}
		</Upsert>
	);
};

export { BrandUpsert };
export interface Props {
	isEditable?: boolean;
	id?: number;
}
