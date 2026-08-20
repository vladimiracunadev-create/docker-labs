#!/usr/bin/env node
// Comprueba el sitio generado antes de publicarlo. Tres reglas:
//
//   1. Ningun enlace interno apunta a una pagina que no existe.
//   2. Ningun ancla apunta a un `id` que no esta en la pagina de destino.
//   3. Ningun enlace del sitio —ni interno ni externo— termina en `.md`.
//
// Las tres fallan igual de silenciosamente: un 404 se publica igual de bien que
// una pagina buena, y un enlace a un `.md` crudo saca al visitante del sitio
// hacia la vista de codigo de GitHub. El despliegue no distingue; esto si.

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");

const HREF = /(?:href|src)="([^"]+)"/g;
const ID = /\sid="([^"]+)"/g;
const EXTERNAL = /^(?:https?:|mailto:|data:)/;

/** Todos los archivos del sitio, en rutas absolutas. */
async function files(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await files(full)));
    else found.push(full);
  }
  return found;
}

/** Ruta del sitio normalizada, con `/` y sin `.` ni `..`. */
function normalize(fromDir, path) {
  const parts = [];
  for (const part of `${fromDir}/${path}`.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

const all = (await files(site)).sort();
const present = new Set(all.map((file) => relative(site, file).split(sep).join("/")));
const html = all.filter((file) => file.endsWith(".html"));

// Los `id` de cada pagina, para poder validar las anclas que apuntan a ella.
const ids = new Map();
const source = new Map();
for (const file of html) {
  const text = await readFile(file, "utf8");
  source.set(file, text);
  ids.set(
    relative(site, file).split(sep).join("/"),
    new Set([...text.matchAll(ID)].map(([, value]) => value))
  );
}

const broken = [];
const markdown = [];
let checked = 0;
let anchors = 0;

for (const file of html) {
  const from = relative(site, file).split(sep).join("/");
  const fromDir = dirname(from) === "." ? "" : dirname(from);

  for (const [, href] of source.get(file).matchAll(HREF)) {
    // Regla 3: aplica a todo enlace, venga de donde venga. Una pagina publicada
    // no manda a nadie a un `.md`.
    if (/\.md($|#)/.test(href)) markdown.push(`${from} → ${href}`);

    if (EXTERNAL.test(href)) continue;
    const [path, anchor] = href.split("#");

    // Ancla dentro de la propia pagina.
    if (!path) {
      if (!anchor) continue;
      anchors += 1;
      if (!ids.get(from)?.has(anchor)) broken.push(`${from} → #${anchor} (ancla inexistente en esta página)`);
      continue;
    }

    checked += 1;
    // Una ruta terminada en barra dependeria de que el servidor sirva el indice
    // del directorio, y Pages no lo hace desde una subruta.
    if (path.endsWith("/")) {
      broken.push(`${from} → ${href} (termina en barra: apunta al index.html explícito)`);
      continue;
    }

    const target = normalize(fromDir, path);
    if (target === "" || target.startsWith("..")) {
      broken.push(`${from} → ${href} (sale del sitio)`);
      continue;
    }
    if (!present.has(target)) {
      broken.push(`${from} → ${href}`);
      continue;
    }
    if (anchor && ids.has(target)) {
      anchors += 1;
      if (!ids.get(target).has(anchor)) broken.push(`${from} → ${href} (ancla inexistente en el destino)`);
    }
  }
}

if (markdown.length > 0) {
  console.error(`❌ ${markdown.length} enlaces apuntan a un .md en vez de a una página HTML:`);
  for (const line of markdown) console.error(`   ${line}`);
}

if (broken.length > 0) {
  console.error(`❌ ${broken.length} enlaces internos rotos:`);
  for (const line of broken) console.error(`   ${line}`);
}

if (broken.length > 0 || markdown.length > 0) process.exit(1);

console.log(
  `✅ ${html.length} páginas · ${checked} enlaces internos y ${anchors} anclas comprobadas · ` +
    `ninguno roto y ninguno apunta a .md`
);
