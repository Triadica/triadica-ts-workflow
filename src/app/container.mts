import { group, object } from "triadica/lib/alias.mjs";
import { compAxis } from "triadica/lib/comp/axis.mjs";
import { range } from "triadica/lib/math.mjs";

import vs from "../../shaders/lines.vert";
import fs from "../../shaders/lines.frag";

export let compContainer = (store: any) => {
  return group(
    {},
    compAxis(),
    object({
      drawMode: "lines",
      vertexShader: vs,
      fragmentShader: fs,
      packedAttrs: range(1000).map((i) => {
        let angle = i * 0.01;
        let r = i * 0.4 + 10;
        return {
          position: [r * Math.cos(angle), r * Math.sin(angle), 0],
        };
      }),
    })
  );
};
