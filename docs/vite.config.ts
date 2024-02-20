import path from 'node:path';
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    base:'/zipkin-api/',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, '../zipkin-api.yaml')),
                    dest: '',
                },
                {
                    src: normalizePath(path.resolve(__dirname, '../zipkin.proto')),
                    dest: '',
                },
                {
                    src: normalizePath(path.resolve(__dirname, '../zipkin2-api.yaml')),
                    dest: '',
                },
            ],
        }),
    ],
})
