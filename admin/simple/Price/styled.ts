import styled, { css } from "styled-components";

export const CROSSED_OUT_LINE_HEIGHT = ".2rem";

export const crossedOutAfterMixin = css`
	left: 0;
	width: 100%;
	opacity: 0.6;
	content: "";
	display: block;
	position: absolute;
	top: calc(50% - ${CROSSED_OUT_LINE_HEIGHT} / 2);
	height: ${CROSSED_OUT_LINE_HEIGHT};
	border-radius: 1rem;
	transform: rotate(-10deg);
`;

export const Number = styled.span`
	position: relative;
`;

export const Price = styled.p<PriceProps>`
	position: relative;
	display: inline-block;
	color: ${(props) => props.theme.colors.common[props.$color]};

	${Number}:after {
		background: ${(props) => props.theme.colors.common[props.$crossedLineColor]};
		${(props) => props.$isCrossedOut && crossedOutAfterMixin};
	}
`;

export const CurrencySymbol = styled.span`
	font-size: 0.8em;
	padding-left: 0.2rem;
`;

export interface PriceProps {
	$color: ColorKind;
	$crossedLineColor: ColorKind;
	$isCrossedOut: boolean;
}

export type ColorKind = "intense" | "red" | "green" | "orange" | "white" | "primary";
