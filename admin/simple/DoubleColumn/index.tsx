import React, { memo } from "react";
import * as S from "./styled";

const DoubleColumn = memo(
	({ firstColumn, firstColumnWidth = 25, secondColumn }: Props) => {
		return (
			<S.DoubleColumn $firstColumnWidth={firstColumnWidth}>
				<S.FirstColumn>{firstColumn}</S.FirstColumn>
				<S.SecondColumn>{secondColumn}</S.SecondColumn>
			</S.DoubleColumn>
		);
	}
);

export { DoubleColumn };
export interface Props {
	firstColumn?: React.ReactNode;
	secondColumn?: React.ReactNode;
	firstColumnWidth?: number;
}
