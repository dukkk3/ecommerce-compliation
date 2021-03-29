import React, { memo } from "react";

import * as S from "./styled";

import { symbolConstants } from "@core/constants";

const Price = memo(
	({
		children,
		color = "intense",
		isCrossedOut = false,
		crossedLineColor = "red",
		currencySymbol = symbolConstants.ROUBLE,
		...rest
	}: Props) => {
		return (
			<S.Price
				$color={color}
				$isCrossedOut={isCrossedOut}
				$crossedLineColor={crossedLineColor}
				{...(rest as any)}>
				<S.Number>{(Number(children) || 0).toLocaleString()}</S.Number>
				<S.CurrencySymbol>{currencySymbol}</S.CurrencySymbol>
			</S.Price>
		);
	}
);

export { Price };
export interface Props extends React.ComponentProps<"p"> {
	children?: number | string;
	currencySymbol?: string;
	color?: S.ColorKind;
	crossedLineColor?: S.ColorKind;
	isCrossedOut?: boolean;
}
