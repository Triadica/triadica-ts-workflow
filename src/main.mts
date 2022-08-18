import * as twgl from "twgl.js";
import produce from "immer";

import { isDev } from "triadica/lib/config.mjs";
import { Atom } from "triadica/lib/atom.mjs";
import { updateStates } from "triadica/lib/cursor.mjs";
import { atomGlContext } from "triadica/lib/global.mjs";
import { loadObjects, onControlEvent, paintCanvas, resetCanvasSize, setupMouseEvents } from "triadica/lib/index.mjs";
import { atomDirtyUniforms, compContainer } from "./app/container.mjs";
import { renderControl, replaceControlLoop, startControlLoop } from "triadica/lib/touch-control.mjs";

let canvas = document.querySelector("canvas");

let atomStore = new Atom({
  v: 0,
  tab: "axis",
  p1: [0, 0, 0],
  states: {},
});

export let main = () => {
  twgl.setDefaults({
    attribPrefix: "a_",
  });

  // TODO inject hud

  resetCanvasSize(canvas);
  atomGlContext.reset(canvas.getContext("webgl", { antialias: true }));
  renderApp();

  renderControl();
  startControlLoop(10, onControlEvent);

  atomStore.addWatch("change", (prev, store) => {
    renderApp();
  });
  atomDirtyUniforms.addWatch("change", (prev, store) => {
    renderApp();
  });

  window.onresize = (event) => {
    resetCanvasSize(canvas);
    paintCanvas();
  };
  setupMouseEvents(canvas);
};

let renderApp = () => {
  loadObjects(compContainer(atomStore.deref()), dispatch);
  paintCanvas();
};

let dispatch = (op: string, data: any) => {
  if (isDev) {
    console.log(op, data);
  }

  let store = atomStore.deref();
  let next = Array.isArray(op)
    ? updateStates(store, [op, data])
    : (() => {
        switch (op) {
          case "tab-focus":
            return produce(store, (s) => {
              store.tab = data;
            });
          default:
            return store;
        }
      })();

  atomStore.reset(next);
};

export let reload = () => {
  // TODO reset-memof1-caches
  atomStore.removeWatch("change");
  atomStore.addWatch("change", (prev, store) => {
    renderApp();
  });
  replaceControlLoop(10, onControlEvent);
  setupMouseEvents(canvas);
  window.onresize = (event) => {
    resetCanvasSize(canvas);
    paintCanvas();
  };

  console.info("reloaded");
};
