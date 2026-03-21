import { defineConfig, Rollup } from "vite";
import uni from '@dcloudio/vite-plugin-uni';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import { createMpChunkSplitterPlugin } from "@minisheep/vite-plugin-mp-chunk-splitter";

export default defineConfig({
  optimizeDeps: {
    exclude: ['@minisheep/three-platform-adapter']
  },
  plugins: [
    glsl(),
    //@ts-expect-error 当前版本在以 esm 形式导出格式异常
    uni.default(),
    visualizer({
      emitFile: true,
    }),
    threePlatformAdapter(),
    createMpChunkSplitterPlugin({
      singleChunkMode: true,
      subpackages: ['sub-pack-2'],
      packageSizeLimit: 1.8 * 1024 * 1024
    }),
    {
      name:'find-dep',
      config(config){
        config.resolve!.preserveSymlinks = false;
      }
    },
  ],
});
