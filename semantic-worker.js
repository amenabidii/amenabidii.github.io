import { pipeline, env } from "./runtime/transformers.min.js";
env.allowRemoteModels = false;
env.localModelPath = "/";
env.backends.onnx.wasm.wasmPaths = new URL("./runtime/", self.location.href).href;
env.backends.onnx.wasm.numThreads = 1;
let extractor;
let questionsIndex;
const options = {pooling:"mean",normalize:true};

self.onmessage = async ({data}) => {
  try {
    if (data.questions) {
      extractor ??= await pipeline("feature-extraction","models");
      questionsIndex ??= (await extractor(data.questions,options)).tolist();
      self.postMessage("ready");
      return;
    }
    const [query] = (await extractor(data.text,options)).tolist();
    const ranked = questionsIndex.map((vector,index) => ({
      index, score:vector.reduce((sum,value,i) => sum + value * query[i],0)
    })).sort((a,b) => b.score - a.score);
    const [best, second] = ranked;
    self.postMessage(best.score >= .53 && best.score-second.score >= .035 ? best.index : -2);
  } catch {
    self.postMessage(-1);
  }
};

