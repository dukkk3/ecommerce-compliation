import { useCallback, useMemo, useRef } from "react";
import { useNotifications } from "@core/hooks";
import { convertBlobToBase64, normalizeBase64 } from "@core/utils";

function useUserFiles({
	mimeType = [],
	sizeLimit = 0,
	countLimit = 0,
	onSelect,
}: Options) {
	const ref = useRef<HTMLInputElement>(null);
	const notifications = useNotifications();
	const transformedMimeType = useMemo(
		() => (Array.isArray(mimeType) ? mimeType : [mimeType]),
		[mimeType]
	);

	const selectFiles = useCallback(() => {
		if (ref.current && countLimit > 0) {
			ref.current.click();
		}
	}, [countLimit]);

	const convertFilesToBase64 = useCallback(async (files: File[]) => {
		const convertedFiles = await Promise.all(files.map(convertBlobToBase64));
		const normalizedFiles = convertedFiles.map(normalizeBase64);

		return normalizedFiles;
	}, []);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const files = event.target.files || [];
			const acceptedFiles = [...files]
				.slice(0, countLimit)
				.filter(
					(file) =>
						file.size <= sizeLimit &&
						(transformedMimeType.includes(file.type) ||
							transformedMimeType.length === 0)
				);

			if (files.length > acceptedFiles.length) {
				notifications.create({
					type: "warning",
					message:
						"Некоторые, выбранные Вами файлы, не удовлетворяют установленным требованиям",
				});
			}

			(event.target.value as any) = null;

			if (onSelect && acceptedFiles.length > 0) {
				onSelect(acceptedFiles);
			}
		},
		[countLimit, transformedMimeType, sizeLimit, notifications, onSelect]
	);

	const getInputProps = useCallback(() => {
		return {
			type: "file",
			accept: transformedMimeType.join(","),
			onChange: handleInputChange,
			disabled: countLimit === 0,
			multiple: countLimit > 1,
			ref: ref,
		};
	}, [transformedMimeType, countLimit, handleInputChange]);

	return { getInputProps, selectFiles, convertFilesToBase64 };
}

export { useUserFiles };
export interface Options {
	mimeType?: string | string[];
	sizeLimit?: number;
	countLimit?: number;
	onSelect?: (files: File[]) => void;
}
