import React, { memo } from "react";
import * as S from "./styled";

const Flex = memo(({ children, ...rest }: Props) => {
	return <S.Flex {...(rest as any)}>{children}</S.Flex>;
});

export { Flex };
export interface Props {
	$flexWrap?: string;
	$flexBasis?: string;
	$flexDirection?: string;
	$justifyContent?: string;
	$alignItems?: string;
	$flexGrow?: string;
	$gap?: string;
	children?: React.ReactNode;
}
