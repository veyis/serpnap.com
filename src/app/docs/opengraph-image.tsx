import { ImageResponse } from "next/og";

export const alt = "Documentation - AI Implementation Knowledge Base | SerpNap";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 64,
					background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #262626 100%)",
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
				{/* Gradient accent overlay */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background:
							"radial-gradient(circle at 70% 30%, rgba(234, 88, 12, 0.15) 0%, transparent 50%)",
					}}
				/>

				{/* Content */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1,
						padding: 40,
					}}
				>
					{/* Icon */}
					<div
						style={{
							width: 80,
							height: 80,
							borderRadius: 20,
							backgroundColor: "rgba(234, 88, 12, 0.2)",
							border: "2px solid rgba(234, 88, 12, 0.4)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 24,
							fontSize: 40,
						}}
					>
						📚
					</div>

					{/* Title */}
					<div
						style={{
							fontSize: 72,
							fontWeight: 800,
							letterSpacing: "-0.04em",
							marginBottom: 16,
							textAlign: "center",
							background: "linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)",
							backgroundClip: "text",
							color: "transparent",
						}}
					>
						Documentation
					</div>

					{/* Subtitle */}
					<div
						style={{
							fontSize: 32,
							opacity: 0.7,
							fontWeight: 400,
							letterSpacing: "-0.01em",
							textAlign: "center",
							maxWidth: 800,
						}}
					>
						AI Implementation Knowledge Base
					</div>

					{/* Topics */}
					<div
						style={{
							display: "flex",
							gap: 16,
							marginTop: 40,
							fontSize: 18,
							opacity: 0.6,
						}}
					>
						<span
							style={{
								padding: "8px 16px",
								backgroundColor: "rgba(234, 88, 12, 0.15)",
								borderRadius: 8,
								border: "1px solid rgba(234, 88, 12, 0.3)",
							}}
						>
							SEO
						</span>
						<span
							style={{
								padding: "8px 16px",
								backgroundColor: "rgba(234, 88, 12, 0.15)",
								borderRadius: 8,
								border: "1px solid rgba(234, 88, 12, 0.3)",
							}}
						>
							Google Ads
						</span>
						<span
							style={{
								padding: "8px 16px",
								backgroundColor: "rgba(234, 88, 12, 0.15)",
								borderRadius: 8,
								border: "1px solid rgba(234, 88, 12, 0.3)",
							}}
						>
							Analytics
						</span>
						<span
							style={{
								padding: "8px 16px",
								backgroundColor: "rgba(234, 88, 12, 0.15)",
								borderRadius: 8,
								border: "1px solid rgba(234, 88, 12, 0.3)",
							}}
						>
							AI Agents
						</span>
					</div>

					{/* Brand */}
					<div
						style={{
							position: "absolute",
							bottom: 40,
							fontSize: 24,
							opacity: 0.5,
							color: "#ea580c",
						}}
					>
						SerpNap
					</div>
				</div>
			</div>
		),
		{ ...size }
	);
}
