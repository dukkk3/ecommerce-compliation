/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useLocalObservable } from "mobx-react-lite";
import type { Schema, Take } from "@core/types";

function useTable<
	S extends Schema.Table<any, any>,
	C extends Take.FromSchema.TableColumnNames<S>,
	B extends Take.FromSchema.TableSchemaBase<S>
>(schema: S) {
	const localStore = useLocalObservable<Store<S>>(() => ({
		rows: {
			value: [],
			set: function (value) {
				this.value = value;
			},
		},
	}));

	const prepareData = useCallback(
		(data: Take.FromSchema.TableModel<S>[]) => {
			const schemaEntries = Object.entries(schema);
			const preparedData = [] as B[];

			data.forEach((row) => {
				const preparedRow = schemaEntries.reduce(
					(acc, [columnName, { takeFromResponseData }]) => ({
						...acc,
						[columnName]: takeFromResponseData(row),
					}),
					{}
				) as B;

				preparedData.push(preparedRow);
			});

			return preparedData;
		},
		[schema]
	);

	const pushRows = useCallback((rows: B[]) => {
		localStore.rows.set([...localStore.rows.value, ...rows]);
	}, []);

	const setRows = useCallback((rows: B[]) => {
		localStore.rows.set(rows);
	}, []);

	const prepareAndSaveData = useCallback(
		(
			data: Take.FromSchema.TableModel<S>[],
			options: { method?: "set" | "push" } = { method: "set" }
		) => {
			const preparedData = prepareData(data);

			if (options.method === "push") {
				pushRows(preparedData);
			} else {
				setRows(preparedData);
			}
		},
		[prepareData, setRows, pushRows]
	);

	const getRows = useCallback(() => {
		return localStore.rows.value;
	}, []);

	const getColumns = useCallback(() => {
		const schemaEntries = Object.entries(schema);
		const columns = schemaEntries.reduce(
			(acc, [columnName, { columnLabel }]) => ({
				...acc,
				[columnName]: columnLabel,
			}),
			{}
		) as Record<C, string>;

		return columns;
	}, [schema]);

	const getColumnsWithPayload = useCallback(() => {
		const schemaEntries = Object.entries(schema);
		const columnsWithPayload = schemaEntries.reduce(
			(acc, [columnName, { columnLabel, takeFromResponseData, ...payload }]) => ({
				...acc,
				[columnName]: {
					label: columnLabel,
					payload,
				},
			}),
			{}
		) as Record<
			C,
			{
				label: string;
				payload: { initialSortingType?: "DESC" | "ASC"; sortingColumnName?: string };
			}
		>;

		return columnsWithPayload;
	}, [schema]);

	const getInitialSortConfig = useCallback(() => {
		const schemaEntries = Object.entries(schema);
		const columnWithSpecifiedInitialSorting = schemaEntries.find(
			([, { sortingColumnName, initialSortingType }]) => {
				return sortingColumnName && initialSortingType;
			}
		);

		if (columnWithSpecifiedInitialSorting) {
			return [
				columnWithSpecifiedInitialSorting[1].sortingColumnName,
				columnWithSpecifiedInitialSorting[1].initialSortingType,
			] as [columnName: string, sortType: "DESC" | "ASC"];
		}

		return [];
	}, [schema]);

	const getArrayOfColumnLabels = useCallback(() => {
		const columns = getColumns();
		const columnLabels = Object.values(columns);

		return columnLabels;
	}, [schema, getColumns]);

	const getColumnOfRows = useCallback((column: C) => {
		return localStore.rows.value.map((row) => row[column]);
	}, []);

	return {
		getRows,
		getColumns,
		getColumnOfRows,
		getArrayOfColumnLabels,
		getInitialSortConfig,
		getColumnsWithPayload,
		setRows,
		prepareData,
		prepareAndSaveData,
	};
}

export { useTable };

type Store<S extends Schema.Table<any, any>> = Schema.Store<{
	rows: Take.FromSchema.TableSchemaBase<S>[];
}>;
