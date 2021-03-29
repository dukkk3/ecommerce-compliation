import styled from "styled-components";

export const FirstColumn = styled.div``;

export const SecondColumn = styled.div``;

export const DoubleColumn = styled.div<DoubleColumnProps>`
	display: flex;
	flex-direction: column;
	flex-direction: row;

	${FirstColumn} {
		flex-basis: ${(props) => props.$firstColumnWidth}%;
		max-width: ${(props) => props.$firstColumnWidth}%;
	}
	${SecondColumn} {
		flex-basis: ${(props) => 100 - props.$firstColumnWidth}%;
		max-width: ${(props) => 100 - props.$firstColumnWidth}%;
	}
`;

export interface DoubleColumnProps {
	$firstColumnWidth: number;
}
