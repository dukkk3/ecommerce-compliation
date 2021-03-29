import React, { memo } from "react";
import { Align } from "@components/simple/Align";
import { Image, Props as ImageProps } from "@components/ui/Image";
import * as S from "./styled";

const Avatar = memo(
	({ image, scale = "small", isRounded = true, ...rest }: Props) => {
		return (
			<S.Avatar $scale={scale} $isRounded={isRounded} {...(rest as any)}>
				<Align axis={["x", "y"]}>
					<Image {...(image as any)} />
				</Align>
			</S.Avatar>
		);
	}
);

export { Avatar };
export interface Props extends React.ComponentProps<"div"> {
	image: ImageProps;
	scale?: "small" | "medium" | "large";
	isRounded?: boolean;
}
