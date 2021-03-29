import React, { memo, useRef } from "react";
import { useZoom } from "@core/hooks";
import { Observer } from "mobx-react-lite";

import { Align } from "@components/simple/Align";

import { Image, Props as ImageProps } from "@components/ui/Image";

import * as S from "./styled";

const ZoomImage = memo(({ image, framesPerSecond = 60, onClick }: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const zoom = useZoom(containerRef, { framesPerSecond: framesPerSecond });

	return (
		<S.ZoomImage ref={containerRef}>
			<S.StaticImage>
				<Align axis={["x", "y"]}>
					<Image {...(image as any)} />
				</Align>
			</S.StaticImage>
			<Observer>
				{() => (
					<S.DynamicImage
						style={{
							background: `url(${image.src || ""}) ${zoom.getPosition().x}% ${
								zoom.getPosition().y
							}% / cover no-repeat`,
						}}
						$isVisible={zoom.isFocused()}
						onMouseLeave={zoom.handleMouseLeave}
						onMouseMove={zoom.handleMouseMove}
						onMouseOver={zoom.handleMouseOver}
						onClick={onClick}
					/>
				)}
			</Observer>
		</S.ZoomImage>
	);
});

export { ZoomImage };
export interface Props {
	image: ImageProps;
	framesPerSecond?: number;
	onClick?: () => void;
}
