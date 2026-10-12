import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = (searchParams.get("title") || "Harley shirts and jumpers").slice(0, 90);
    const description = (
        searchParams.get("description") ||
        "U.S.A. Motorcycle Centre. Shirts and jumpers from the Albion Park Rail rack. Est. 1992."
    ).slice(0, 180);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: "#000B58",
                    color: "#ffffff",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div style={{ width: 22, height: "100%", background: "#FF1414", display: "flex" }} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "52px 48px",
                        flex: 1,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 22,
                            letterSpacing: 5,
                            textTransform: "uppercase",
                            color: "#FF6262",
                        }}
                    >
                        U.S.A. Motorcycle Centre
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 62,
                            fontWeight: 700,
                            lineHeight: 1.02,
                            letterSpacing: -1,
                        }}
                    >
                        {title}
                    </div>
                    <div style={{ display: "flex", fontSize: 26, lineHeight: 1.35, color: "#A2B5CB" }}>
                        {description}
                    </div>
                </div>
                <div
                    style={{
                        width: 210,
                        height: "100%",
                        background: "#FF1414",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: 48,
                        color: "#ffffff",
                        fontSize: 22,
                        letterSpacing: 3,
                    }}
                >
                    EST 1992
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
