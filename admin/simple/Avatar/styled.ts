import { Image, NativeImage } from "@components/ui/Image/styled";
import styled from "styled-components";

const SCALE = {
	large: "5rem",
	medium: "3.5rem",
	small: "3rem",
};

export const Avatar = styled.div<AvatarProps>`
	width: ${(props) => SCALE[props.$scale]};
	height: ${(props) => SCALE[props.$scale]};
	border-radius: ${(props) =>
		props.$isRounded ? "50%" : props.theme.sizes.common.borderRadius};
	overflow: hidden;

	${Image} {
		width: 100%;
		height: 100%;

		${NativeImage} {
			object-fit: cover;
			height: 100%;
			width: 100%;
		}
	}
`;

export interface AvatarProps {
	$scale: "small" | "medium" | "large";
	$isRounded?: boolean;
}
