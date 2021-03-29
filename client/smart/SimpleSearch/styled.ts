import { Suspense } from "@components/ordinary/Suspense/styled";
import { Row, Body } from "@components/ordinary/Table/styled";
import { Card, boxShadowMixin } from "@components/simple/Card/styled";
import { scrollBarMixin } from "@components/simple/ScrollBar/styled";
import styled from "styled-components";

export const RESULT_ADDITIONAL_OFFSET_ORDINATE = "1rem";
export const RESULT_OFFSET_ORDINATE = `calc(100% + ${RESULT_ADDITIONAL_OFFSET_ORDINATE})`;

export const SimpleSearch = styled.div`
	position: relative;
	z-index: 55;
`;

export const InputGroup = styled.div``;

export const Results = styled(Card)<ResultsProps>`
	position: absolute;
	width: 100%;
	max-height: 30rem;
	overflow-y: auto;
	top: ${RESULT_OFFSET_ORDINATE};
	left: 0;
	display: ${(props) => (props.$isVisible ? "block" : "none")};
	${boxShadowMixin}
	${scrollBarMixin}

	${Suspense} {
		height: ${(props) => props.$isSuspense && "10rem"};
	}
	${Body} {
		a {
			&:not(:first-child) ${Row} {
				border-top: 1px solid ${(props) => props.theme.colors.complex.border};
			}
		}
	}
`;

export const DiscountPriceGroup = styled.div`
	text-align: right;
`;

export const NotFound = styled.p`
	text-align: center;
	padding: 2rem;
`;

export interface ResultsProps {
	$isVisible?: boolean;
	$isSuspense?: boolean;
}
