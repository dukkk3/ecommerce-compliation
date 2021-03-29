import React, { memo } from "react";
import * as S from "./styled";

const BreadCrumbs = memo(({ paths = [], delimiter = "/" }: Props) => {
	return (
		<S.BreadCrumbs>
			{paths.map((path, index) => (
				<React.Fragment key={`path-${index}`}>
					<S.Path>{path.name}</S.Path>
					{paths.length - 1 !== index ? (
						<S.Delimiter>{delimiter}</S.Delimiter>
					) : null}
				</React.Fragment>
			))}
		</S.BreadCrumbs>
	);
});

export { BreadCrumbs };
export interface Props {
	paths?: { to: string; name: string }[];
	delimiter?: string;
}
