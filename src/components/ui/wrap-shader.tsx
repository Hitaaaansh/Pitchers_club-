import { Warp } from "@paper-design/shaders-react";

export default function WarpShaderHero() {
  return (
    <div className="absolute inset-0">
      <Warp
        colors={["#1E1E1E", "#A50000", "#3a0000", "#0a0000"]}
        speed={0.4}
        scale={1}
        rotation={0}
        proportion={0.45}
        softness={1}
        distortion={0.25}
        swirl={0.85}
        swirlIterations={10}
        shape="checks"
        shapeScale={0.1}
        style={{ width: "100%", height: "100%" }}
        minPixelRatio={1}
        maxPixelCount={1280 * 720}
      />
    </div>
  );
}
