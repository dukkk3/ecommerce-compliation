import styled, { css } from "styled-components";

const notAdaptableMixin = css`
	width: 100%;
	height: 100%;
	max-height: 100%;
	max-width: 100%;
`;

const adaptableMixin = css<AlignProps>`
	width: ${(props) => !props.$axis.includes("x") && "100%"};
	height: ${(props) => !props.$axis.includes("y") && "100%"};
	min-width: ${(props) => props.$axis.includes("x") && "100%"};
	min-height: ${(props) => props.$axis.includes("y") && "100%"};
`;

export const Align = styled.div<AlignProps>`
	display: flex;
	flex-grow: 1;
	justify-content: ${(props) => (props.$axis.includes("x") ? "center" : "start")};
	align-items: ${(props) => (props.$axis.includes("y") ? "center" : "start")};
	${(props) => (props.$isAdaptable ? adaptableMixin : notAdaptableMixin)};
`;

export interface AlignProps {
	$axis: Axis;
	$isAdaptable?: boolean;
}

export type Axis = ("y" | "x")[] | "x" | "y";
