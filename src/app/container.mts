import { TriadicaObjectData } from "triadica/lib/primes.mjs";
import { group, object } from "triadica/lib/alias.mjs";
import { Atom } from "triadica/lib/atom.mjs";

import vs from "../../shaders/lines.vert";
import fs from "../../shaders/lines.frag";

export let atomDirtyUniforms = new Atom({});

let range = (n: number): number[] => {
  let ret = [];
  for (let idx = 0; idx < n; idx++) {
    ret.push(idx);
  }
  return ret;
};

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

let compAxis = (): TriadicaObjectData => {
  return object({
    vertexShader: vs,
    fragmentShader: fs,
    drawMode: "lines",
    points: [
      [-400, 0, 0],
      [400, 0, 0],
      [0, 400, 0],
      [0, -400, 0],
      [0, 0, -400],
      [0, 0, 400],
    ],
  });
};
