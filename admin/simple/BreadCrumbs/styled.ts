import styled from "styled-components";

export const BreadCrumbs = styled.p`
	color: ${(props) => props.theme.colors.common.grey};
	font-size: ${(props) => props.theme.sizes.common.fontSizeSecondary};
`;

export const Path = styled.span`
	cursor: default;
`;

export const Delimiter = styled(Path)`
	cursor: default;
	padding: 0 1rem;
`;
