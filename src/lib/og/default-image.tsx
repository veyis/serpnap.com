import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

export async function generateOgImage(options?: {
	title?: string;
	description?: string;
	features?: string[];
}) {
	const {
		title = "SerpNap",
		description = "Free SEO Tools — Snap Your SEO Into Shape",
		features = ["SEO Checker", "Meta Tags", "Schema Generator", "Technical Audit"],
	} = options || {};

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 64,
					background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f172a 100%)",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1,
						textAlign: "center",
						padding: "0 60px",
					}}
				>
					<div
						style={{
							fontSize: title.length > 20 ? 64 : 96,
							fontWeight: 800,
							letterSpacing: "-0.04em",
							background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
							backgroundClip: "text",
							color: "transparent",
							marginBottom: 24,
						}}
					>
						{title}
					</div>

					<div
						style={{
							fontSize: description.length > 60 ? 24 : 32,
							opacity: 0.8,
							fontWeight: 400,
							letterSpacing: "-0.01em",
							maxWidth: 900,
						}}
					>
						{description}
					</div>

					{features.length > 0 && (
						<div
							style={{
								display: "flex",
								gap: 32,
								marginTop: 48,
								fontSize: 18,
								opacity: 0.6,
							}}
						>
							{features.map((feature, i) => (
								<span key={feature}>
									{i > 0 && <span style={{ marginRight: 32 }}>·</span>}
									{feature}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		),
		{ ...ogImageSize },
	);
}

export async function generateDefaultOgImage() {
	return generateOgImage();
}
