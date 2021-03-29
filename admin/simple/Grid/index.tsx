import React, { memo } from "react";
import * as S from "./styled";

const Grid = memo(({ children, ...rest }: Props) => {
	return <S.Grid {...(rest as any)}>{children}</S.Grid>;
});

export { Grid };
export interface Props extends React.HTMLProps<HTMLDivElement> {
	children?: React.ReactNode;
	$templateColumns?: string;
	$templateRows?: string;
	$gap?: string;
}
