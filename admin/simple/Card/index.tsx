import React, { memo } from "react";
import * as S from "./styled";

const Card = memo(({ children, ...rest }: Props) => {
	return <S.Card {...(rest as any)}>{children}</S.Card>;
});

export { Card };
export interface Props extends React.ComponentProps<"div"> {
	children?: React.ReactNode;
}
