import styled, { css } from "styled-components";

export const LAYOUT_CONTAINER_PADDING_ORDINATE = "2rem";
export const LAYOUT_CONTAINER_PADDING_ABSCISSA = "5rem";

export const containerMixin = css`
	padding: ${LAYOUT_CONTAINER_PADDING_ORDINATE} ${LAYOUT_CONTAINER_PADDING_ABSCISSA};
`;

export const LayoutContainer = styled.div`
	${containerMixin}
`;
