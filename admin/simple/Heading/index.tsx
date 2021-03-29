import React, { memo } from "react";
import * as S from "./styled";

const Heading = memo(({ children, ...rest }: Props) => {
	return <S.Heading {...(rest as any)}>{children}</S.Heading>;
});

export { Heading };
export interface Props extends React.ComponentProps<"p"> {}
