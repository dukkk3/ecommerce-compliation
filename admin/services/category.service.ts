import { api } from "@core/api";
import { routesConfig } from "@core/config";
import { formSchemes } from "@core/schemes";
import type { API, Take } from "@core/types";
import type { ProductModel, ImageModel, CategoryModel } from "@core/models";

export function create(...data: Parameters<typeof prepareDataBeforeUpsert>) {
	return api.put<API.Service.Response.Upsert<CategoryModel>>(
		routesConfig.categoryApiRoutes.create(),
		prepareDataBeforeUpsert(...data)
	);
}

export function update(
	id: number,
	...data: Parameters<typeof prepareDataBeforeUpsert>
) {
	return api.post<API.Service.Response.Upsert<CategoryModel>>(
		routesConfig.categoryApiRoutes.update(id),
		prepareDataBeforeUpsert(...data)
	);
}

export function remove(id: number) {
	return api.delete<API.Service.Response.Upsert<number>>(
		routesConfig.categoryApiRoutes.remove(id)
	);
}

export function findOneByID(id: number) {
	return api.get<
		API.Service.Response.FindOne<
			CategoryModel & {
				image: ImageModel | null;
				products: ProductModel[];
			}
		>
	>(routesConfig.categoryApiRoutes.findOne(id));
}

export function findMany(params: { [s: string]: any }) {
	return api.get<
		API.Service.Response.FindMany<
			CategoryModel & {
				image: ImageModel | null;
				parent: CategoryModel | null;
			}
		>
	>(routesConfig.categoryApiRoutes.findMany(), {
		params,
	});
}

export function parentList(id: number) {
	return (params: { [s: string]: any }) => {
		return api.get<
			API.Service.Response.FindMany<
				CategoryModel & {
					image: ImageModel | null;
					parent: CategoryModel | null;
				}
			>
		>(routesConfig.categoryApiRoutes.parentList(id), {
			params,
		});
	};
}

export function getAll() {
	return api.get<
		API.Service.Response.FindMany<
			CategoryModel & {
				image: ImageModel | null;
				parent: CategoryModel | null;
			}
		>
	>(routesConfig.categoryApiRoutes.getAll());
}

function prepareDataBeforeUpsert(
	data: Record<
		Take.FromSchema.FormFieldNames<typeof formSchemes["category"]>,
		string
	> & {
		imageId: number | null;
		parentId: number | null;
		productsId: number[];
	}
): Omit<CategoryModel, "id" | "parentsId"> & {
	imageId: number | null;
	productsId: number[];
} {
	return {
		name: data.name,
		code: data.code,
		config: {
			isShowOnMainPage: (data.isShowOnMainPage as unknown) as boolean,
			isActive: (data.isActive as unknown) as boolean,
		},
		info: {
			description: data.description,
		},
		seo: {
			title: data.seoTitle,
			keywords: data.seoKeywords,
			description: data.seoDescription,
		},
		parentId: data.parentId,
		imageId: data.imageId,
		productsId: data.productsId,
	};
}
