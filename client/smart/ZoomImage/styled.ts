import styled from "styled-components";

export const ZoomImage = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
`;

export const StaticImage = styled.div`
	width: 100%;
	height: 100%;
`;

export const DynamicImage = styled.div<DynamicImageProps>`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
	top: 0;
	left: 0;
	cursor: default;
	opacity: ${(props) => (props.$isVisible ? 1 : 0)};
	transition: opacity 0.2s;
`;

export interface DynamicImageProps {
	$isVisible?: boolean;
}
