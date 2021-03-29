import React, { memo } from "react";
import * as S from "./styled";

const LayoutContainer = memo(({ children, ...rest }: Props) => {
	return <S.LayoutContainer {...(rest as any)}>{children}</S.LayoutContainer>;
});

export { LayoutContainer };
export interface Props extends React.ComponentProps<"div"> {
	children?: React.ReactNode;
}
