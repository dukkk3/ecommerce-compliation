/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo } from "react";
import { useLocalObservable } from "mobx-react-lite";
import type { Schema, Take, FieldPropCollection } from "@core/types";

function useForm<S extends Schema.Form<any>, N extends Take.FromSchema.FormFieldNames<S>>(
	schema: S
) {
	const schemaEntries = useMemo(() => Object.entries(schema), [schema]);

	const collectActions = useCallback(() => {
		const actions = schemaEntries.reduce((acc, [name]) => {
			return {
				...acc,
				[name]: function (value: string | false) {
					(this as any)[name] = value;
				},
			};
		}, {} as Record<N, (value: string | false) => void>);

		return actions;
	}, [schemaEntries]);

	const collectInitialValues = useCallback(() => {
		const values = schemaEntries.reduce((acc, [name, { props }]) => {
			return { ...acc, [name]: props.value || "" };
		}, {} as Record<N, string>);

		return values;
	}, [schemaEntries]);

	const localStore = useLocalObservable<Store<N>>(() => ({
		values: {
			value: collectInitialValues(),
			set: function (value) {
				this.value = value;
			},
		},
		actions: {
			value: collectActions(),
			set: function (value) {
				this.value = value;
			},
		},
		isDisabled: {
			value: false,
			set: function (value) {
				this.value = value;
			},
		},
	}));

	const bindField = useCallback(
		<F extends N>(
			name: F,
			options: Partial<FieldPropCollection[Take.FromSchema.FormSchemaBase<S>[F]]> = {}
		) => {
			const { type, label, props } = schema[name];
			const { onChange, ...otherOptions } = options;

			return {
				type,
				label,
				props: {
					...props,
					...otherOptions,
					id: name,
					disabled: localStore.isDisabled.value,
					value: localStore.values.value[name] || "",
					onChange: onFieldChange(name, options) as any,
				},
			};
		},
		[]
	);

	const getValues = useCallback(() => {
		return localStore.values.value;
	}, []);

	const setFieldValue = useCallback((name: N, value: string) => {
		localStore.actions.value[name].call(localStore.values.value, value);
	}, []);

	const setValues = useCallback((values: Record<N, string>) => {
		localStore.values.set(values);
	}, []);

	const onFieldChange = useCallback(
		(name: N, options: Pick<BindFieldOptions, "onChange"> = {}) => (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			const { value } = event.target;

			setFieldValue(name, value);

			if (options.onChange) {
				options.onChange(event);
			}
		},
		[setFieldValue]
	);
	const setDisableStatus = useCallback((value: boolean) => {
		localStore.isDisabled.set(value);
	}, []);

	useEffect(() => {
		const actions = collectActions();
		const values = collectInitialValues();
		localStore.actions.set(actions);
		localStore.values.set(values);
	}, [collectActions, collectInitialValues]);

	return {
		getValues,
		setValues,
		setFieldValue,
		setDisableStatus,
		bindField,
	};
}

export { useForm };

interface BindFieldOptions extends React.ComponentProps<"input"> {}

type Store<N extends string> = Schema.Store<{
	values: Record<N, string>;
	actions: Record<N, (value: string | false) => void>;
	isDisabled: boolean;
}>;
