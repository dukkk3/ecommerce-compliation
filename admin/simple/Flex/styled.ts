import styled from "styled-components";

export const Flex = styled.div<FlexProps>`
	display: flex;
	flex-wrap: ${(props) => props.$flexWrap};
	flex-basis: ${(props) => props.$flexBasis};
	flex-direction: ${(props) => props.$flexDirection};
	justify-content: ${(props) => props.$justifyContent};
	align-items: ${(props) => props.$alignItems};
	flex-grow: ${(props) => props.$flexGrow};
	gap: ${(props) => props.$gap};
`;

export interface FlexProps {
	$flexWrap?: string;
	$flexBasis?: string;
	$flexDirection?: string;
	$justifyContent?: string;
	$alignItems?: string;
	$flexGrow?: string;
	$gap?: string;
}
