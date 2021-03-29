import styled from "styled-components";

export const Grid = styled.div<GridProps>`
	display: grid;
	grid-template-columns: ${(props) => props.$templateColumns};
	grid-template-rows: ${(props) => props.$templateRows};
	grid-gap: ${(props) => props.$gap};
`;

export interface GridProps {
	$templateColumns?: string;
	$templateRows?: string;
	$gap?: string;
}
