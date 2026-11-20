import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js";
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
let extractor;
let questionsIndex;
const options = {pooling:"mean",normalize:true};

self.onmessage = async ({data}) => {
  try {
    extractor ??= await pipeline("feature-extraction","Xenova/all-MiniLM-L6-v2");
    questionsIndex ??= (await extractor(data.questions,options)).tolist();
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
