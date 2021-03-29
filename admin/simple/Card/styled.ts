import { transparentize } from "polished";
import styled, { css } from "styled-components";

export const boxShadowMixin = css`
	box-shadow: ${(props) =>
		`0px 3px 3px 1px ${transparentize(0.97, props.theme.colors.common.grey)}`};
`;

export const cardMixin = css`
	background: ${(props) => props.theme.colors.background.primary};
	border-radius: ${(props) => props.theme.sizes.common.borderRadius};
	border: 1px solid ${(props) => props.theme.colors.complex.border};
	overflow: hidden;
`;

export const Card = styled.div`
	${cardMixin}
`;
