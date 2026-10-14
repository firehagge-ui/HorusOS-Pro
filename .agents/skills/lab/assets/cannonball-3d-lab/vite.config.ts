import { createReadStream, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { sites } from "@openai/sites-vite-plugin";
import vinext from "vinext";
import { defineConfig, type Plugin } from "vite";
import hostingConfig from "./.openai/hosting.json";

const MIME: Record<string, string> = {
  ".bin": "application/octet-stream",
  ".exr": "image/x-exr",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".hdr": "image/vnd.radiance",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".ktx2": "image/ktx2",
  ".png": "image/png",
  ".webp": "image/webp",
};

function extension(pathname: string) {
  const match = pathname.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function serveFolder(root: string) {
  const safeRoot = resolve(root);
  return (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
    const target = resolve(safeRoot, `.${pathname}`);
    if (target !== safeRoot && !target.startsWith(`${safeRoot}${sep}`)) {
      response.statusCode = 403;
      response.end("Forbidden");
      return;
    }
    try {
      const stat = statSync(target);
      if (!stat.isFile()) return next();
      response.setHeader("Content-Type", MIME[extension(target)] ?? "application/octet-stream");
      response.setHeader("Content-Length", stat.size);
      response.setHeader("Cache-Control", "no-store");
      createReadStream(target).pipe(response);
    } catch {
      next();
    }
  };
}

function localThreeAssets(): Plugin {
  const corpus = resolve(process.cwd(), "assets-3d");
  const draco = resolve(process.cwd(), "node_modules/three/examples/jsm/libs/draco/gltf");
  const basis = resolve(process.cwd(), "node_modules/three/examples/jsm/libs/basis");
  const mount = (server: { middlewares: { use: (route: string, handler: ReturnType<typeof serveFolder>) => void } }) => {
    server.middlewares.use("/assets-3d", serveFolder(corpus));
    server.middlewares.use("/three-decoders/draco", serveFolder(draco));
    server.middlewares.use("/three-decoders/basis", serveFolder(basis));
  };
  return { name: "local-three-assets", configureServer: mount, configurePreviewServer: mount };
}

function labHealth(): Plugin {
  const mount = (server: { middlewares: { use: (route: string, handler: (request: IncomingMessage, response: ServerResponse) => void) => void } }) => {
    server.middlewares.use("/__cannonball_lab_health", (_request, response) => {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.setHeader("Cache-Control", "no-store");
      response.end(JSON.stringify({ app: "cannonball-3d-lab", status: "ok" }));
    });
  };
  return { name: "cannonball-lab-health", configureServer: mount, configurePreviewServer: mount };
}

const { d1, r2 } = hostingConfig;
const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1 ? [{ binding: d1, database_name: "site-creator-d1", database_id: "00000000-0000-4000-8000-000000000000" }] : [],
  r2_buckets: r2 ? [{ binding: r2, bucket_name: "site-creator-r2" }] : [],
};

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    server: { watch: { ignored: ["**/.local-models/**", "**/assets-3d/**", "**/outputs/**"] } },
    plugins: [
      labHealth(),
      localThreeAssets(),
      vinext(),
      sites(),
      cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] }, config: localBindingConfig }),
    ],
  };
});
