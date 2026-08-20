#!/usr/bin/env node
// Genera el sitio de GitHub Pages a partir del propio repositorio.
//
// El sitio no se escribe a mano: la portada sale de `labs.config.json` y de los
// manifiestos de cada lab, y las paginas de documentacion salen de los `.md` que
// ya viven en el repo. Asi la web no puede contradecir al repositorio, que es el
// fallo mas comun de un sitio de proyecto mantenido aparte.
//
// Sin dependencias: el renderizador de Markdown de abajo cubre lo que usan los
// documentos del repo (encabezados, listas anidadas, tablas, bloques de codigo,
// citas, avisos, enlaces, imagenes, autoenlaces y enfasis). Traer marked para
// esto significaria un package.json en la raiz de un repo que no tiene ninguno.

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site");
const REPO = "vladimiracunadev-create/docker-labs";
const GITHUB = `https://github.com/${REPO}`;
const GITHUB_BLOB = `${GITHUB}/blob/main/`;

// Los .md del repositorio se escriben con LF, pero un clon en Windows puede
// traerlos con CRLF: el separador tiene que aceptar los dos.
const NEWLINES = /\r?\n/;
const LAB_DIR = /^\d{2}-[a-z0-9-]+$/;

const escape = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── Rutas: del repositorio al sitio ──────────────────────────────────────────

/**
 * La URL de un documento: el nombre del archivo en minusculas y con guiones.
 * `TECHNICAL_SPECS.md` y `windows-installer.md` conviven en docs/, pero en el
 * sitio ambos se publican con la misma forma.
 */
const docSlug = (name) => name.replace(/\.md$/, "").toLowerCase().replace(/_/g, "-");

/** Normaliza una ruta relativa del repositorio (resuelve `.` y `..`). */
function normalizeRepoPath(path) {
  const parts = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

/**
 * Donde vive en el sitio un archivo del repositorio, o `null` si no se publica.
 *
 * Tres familias, y la ruta del sitio lo dice sin ambiguedad:
 *   docs/X.md          -> docs/<slug>.html    documentacion tecnica
 *   NN-lab/README.md   -> labs/<lab>.html     ficha del laboratorio
 *   X.md (raiz)        -> guias/<slug>.html   guias del repositorio
 *
 * Todo lo demas —codigo, workflows, LICENSE— no tiene pagina y se enlaza a
 * GitHub, que es donde ese archivo realmente vive.
 */
function repoToSite(repoPath) {
  const segments = repoPath.split("/");
  if (segments.length === 2 && segments[0] === "docs" && segments[1].endsWith(".md")) {
    return `docs/${docSlug(segments[1])}.html`;
  }
  if (segments.length === 2 && LAB_DIR.test(segments[0]) && segments[1] === "README.md") {
    return `labs/${segments[0]}.html`;
  }
  if (segments.length === 1 && segments[0].endsWith(".md")) {
    return `guias/${docSlug(segments[0])}.html`;
  }
  return null;
}

/** Enlace relativo entre dos rutas del sitio, visto desde el directorio `from`. */
function relativeHref(fromDir, toPath) {
  const from = fromDir ? fromDir.split("/") : [];
  const to = toPath.split("/");
  let shared = 0;
  while (shared < from.length && shared < to.length - 1 && from[shared] === to[shared]) shared += 1;
  return "../".repeat(from.length - shared) + to.slice(shared).join("/");
}

/**
 * El identificador de un encabezado, con las mismas reglas que GitHub: se pasa
 * a minusculas, se retira todo lo que no sea letra, numero, espacio o guion
 * —incluidos los emoji y el marcado— y los espacios pasan a guiones.
 *
 * Importa que coincida con GitHub porque los enlaces con ancla se escribieron
 * leyendo el repositorio; si aqui generasemos otro identificador, el mismo
 * enlace funcionaria en GitHub y no en el sitio publicado.
 */
function headingId(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*?([^*]+)\*\*?/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    // Ni se recortan los extremos ni se colapsan los espacios: GitHub tampoco
    // lo hace. Un emoji al principio deja un guion delante. Ese detalle es
    // justo lo que hace que el ancla coincida.
    .replace(/\s/g, "-");
}

// ── Markdown minimo ──────────────────────────────────────────────────────────

/**
 * A donde apunta un enlace del markdown una vez publicado.
 *
 * `srcDir` es la carpeta del repositorio donde se escribio el enlace y `pageDir`
 * la carpeta del sitio donde acaba la pagina. Sin el primero no se puede
 * distinguir un `../README.md` escrito desde `docs/` —raiz del repo, publicado
 * en guias/— de uno escrito desde un lab.
 */
function resolveHref(href, srcDir, pageDir) {
  if (/^(https?:|mailto:|#)/.test(href) || href === "") return href;
  const [rawPath, ...rest] = href.split("#");
  const anchor = rest.length ? `#${rest.join("#")}` : "";
  const repoPath = normalizeRepoPath(srcDir ? `${srcDir}/${rawPath}` : rawPath);
  const sitePath = repoToSite(repoPath);
  if (sitePath) return relativeHref(pageDir, sitePath) + anchor;
  return GITHUB_BLOB + repoPath + anchor;
}

function inlineText(text, srcDir, pageDir) {
  return escape(text)
    .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
    // Las imagenes van antes que los enlaces: una insignia se escribe como una
    // imagen dentro de un enlace, y al reves el enlace se comeria el `![`.
    .replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (_, alt, src) => `<img src="${escape(src)}" alt="${alt}" loading="lazy">`
    )
    .replace(/\[([^\]]*)\]\(([^)\s]*)\)/g, (_, label, href) => {
      // Un enlace sin destino —`[texto]()`— no navega a ninguna parte: se
      // publica el texto y se descarta el ancla vacia.
      if (href === "") return label;
      const target = resolveHref(href, srcDir, pageDir);
      const external = /^(https?:|mailto:)/.test(target);
      return `<a href="${escape(target)}"${external ? ' target="_blank" rel="noreferrer noopener"' : ""}>${label}</a>`;
    })
    // Autoenlace estilo Markdown: <http://localhost:9090>. Tras escapar, los
    // angulos ya son entidades.
    .replace(
      /&lt;(https?:\/\/[^\s&]+)&gt;/g,
      (_, url) => `<a href="${escape(url)}" target="_blank" rel="noreferrer noopener">${url}</a>`
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

/** Indentacion de una linea de lista, en niveles de dos espacios. */
const listDepth = (line) => Math.floor((line.match(/^\s*/)[0].replace(/\t/g, "  ").length) / 2);
const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

/**
 * Una lista completa, con sus niveles. Se hace aparte porque el CHANGELOG y la
 * guia del instalador anidan viñetas, y una lista aplanada pierde justo la
 * jerarquia que se escribio para leerse.
 */
function renderList(lines, start, inline) {
  const items = [];
  let index = start;
  const baseDepth = listDepth(lines[start]);
  const ordered = /^\s*\d+\./.test(lines[start]);

  while (index < lines.length) {
    const match = lines[index].match(LIST_ITEM);
    if (!match) break;
    const depth = listDepth(lines[index]);
    if (depth < baseDepth) break;
    if (depth > baseDepth) {
      const [html, next] = renderList(lines, index, inline);
      items[items.length - 1] = (items[items.length - 1] ?? "<li>") + html;
      index = next;
      continue;
    }
    let content = match[3];
    // Casilla de tarea: se publica como simbolo, no como los corchetes crudos.
    const task = content.match(/^\[([ xX])\]\s+(.*)$/);
    if (task) content = `<span class="task">${task[1].trim() ? "☑" : "☐"}</span> ${task[2]}`;
    items.push(`<li>${inline(content)}`);
    index += 1;
  }

  const tag = ordered ? "ol" : "ul";
  return [`<${tag}>${items.map((item) => `${item}</li>`).join("")}</${tag}>`, index];
}

function renderMarkdown(markdown, srcDir, pageDir) {
  const inline = (text) => inlineText(text, srcDir, pageDir);
  const lines = markdown.split(NEWLINES);
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) body.push(lines[index++]);
      index += 1;
      if (language === "mermaid") html.push(`<pre class="mermaid">${escape(body.join("\n"))}</pre>`);
      else html.push(`<pre><code>${escape(body.join("\n"))}</code></pre>`);
      continue;
    }

    if (line.startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[index + 1] ?? "")) {
      const head = line.split("|").slice(1, -1).map((cell) => cell.trim());
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].startsWith("|")) {
        rows.push(lines[index++].split("|").slice(1, -1).map((cell) => cell.trim()));
      }
      html.push(
        `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
          `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      const id = headingId(heading[2]);
      html.push(
        `<h${level} id="${id}">${inline(heading[2])}` +
          `<a class="anchor" href="#${id}" aria-label="enlace a esta seccion">#</a></h${level}>`
      );
      index += 1;
      continue;
    }

    if (/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/.test(line)) {
      const kind = line.match(/\[!(\w+)\]/)[1].toLowerCase();
      const body = [];
      index += 1;
      while (index < lines.length && lines[index].startsWith(">")) body.push(lines[index++].replace(/^>\s?/, ""));
      html.push(`<div class="callout ${kind}">${inline(body.join(" ").trim())}</div>`);
      continue;
    }

    if (line.startsWith(">")) {
      const body = [];
      while (index < lines.length && lines[index].startsWith(">")) body.push(lines[index++].replace(/^>\s?/, ""));
      html.push(`<blockquote>${inline(body.join(" ").trim())}</blockquote>`);
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const [listHtml, next] = renderList(lines, index, inline);
      html.push(listHtml);
      index = next;
      continue;
    }

    if (/^(---+|===+|\*\*\*+)$/.test(line.trim())) {
      html.push("<hr>");
      index += 1;
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraph = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^\s*([#>|`]|[-*]\s|\d+\.\s)/.test(lines[index])
    ) {
      paragraph.push(lines[index++]);
    }
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    else index += 1;
  }

  return html.join("\n");
}

/** Titulo de un documento: su primer encabezado de nivel 1. */
function docTitle(markdown, fallback) {
  const heading = markdown.split(NEWLINES).find((line) => line.startsWith("# "));
  return heading ? heading.slice(2).trim() : fallback;
}

/**
 * Una linea que resuma el documento para la tarjeta del indice: el primer
 * parrafo de prosa real, saltando insignias, citas de cabecera y tablas.
 */
function docSummary(markdown) {
  const lines = markdown.split(NEWLINES);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line === "" || line.startsWith("#") || line.startsWith(">") || line.startsWith("|")) continue;
    if (line.startsWith("---") || line.startsWith("```") || line.startsWith("[!") || line.startsWith("[![")) continue;
    if (/^[-*]\s/.test(line)) continue;
    const plain = line
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
    return plain.length > 165 ? `${plain.slice(0, 162).trimEnd()}...` : plain;
  }
  return "";
}

// ── Plantilla ────────────────────────────────────────────────────────────────

const STYLE = await readFile(join(root, "site-src", "_style.css"), "utf8");

const NAV = [
  ["index.html", "Inicio"],
  ["labs/index.html", "Laboratorios"],
  ["docs/index.html", "Documentación"],
  ["guias/index.html", "Guías"],
];

function page({ title, description, body, active = "index.html", dir = "" }) {
  const nav = NAV.map(([target, label]) => {
    const cls = active === target ? ' class="on"' : "";
    return `<a${cls} href="${relativeHref(dir, target)}">${label}</a>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="description" content="${escape(description)}">
<title>${escape(title)}</title>
<style>${STYLE}</style>
</head>
<body>
<header class="topbar"><div class="topbar-in">
  <a class="brand" href="${relativeHref(dir, "index.html")}">🐳 docker-labs</a>
  <nav>${nav}</nav>
  <a class="gh" href="${GITHUB}" target="_blank" rel="noreferrer noopener">GitHub ↗</a>
</div></header>
<main class="shell">
${body}
</main>
<footer class="foot"><div class="shell">
  docker-labs · Apache-2.0 ·
  <a href="${GITHUB}" target="_blank" rel="noreferrer noopener">código</a> ·
  <a href="${relativeHref(dir, "guias/security.html")}">seguridad</a> ·
  <a href="${relativeHref(dir, "guias/changelog.html")}">cambios</a>
</div></footer>
<script type="module">
  // startOnLoad solo actua si mermaid se carga antes de que el DOM este listo.
  // Con un import dinamico posterior no hace nada: hay que llamar a run() a
  // mano. Ese es el motivo por el que un diagrama se quedaria en blanco.
  const blocks = document.querySelectorAll("pre.mermaid");
  if (blocks.length) {
    try {
      const { default: mermaid } = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
      const dark = matchMedia("(prefers-color-scheme: dark)").matches;
      mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", securityLevel: "strict" });
      await mermaid.run({ nodes: blocks });
    } catch (error) {
      // Sin red, con el CDN caido o con un bloqueador de por medio, el diagrama
      // se queda como codigo legible en vez de desaparecer sin mas.
      for (const block of blocks) {
        block.classList.add("mermaid-fallback");
        block.dataset.note = "diagrama sin renderizar · " + error.message;
      }
    }
  }
</script>
</body>
</html>
`;
}

// ── Datos del repositorio ────────────────────────────────────────────────────

const catalog = JSON.parse(await readFile(join(root, "labs.config.json"), "utf8"));
const version = (await readFile(join(root, "version.txt"), "utf8")).trim();

const labs = [];
for (const lab of catalog.labs) {
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(join(root, lab.id, "lab-manifest.json"), "utf8"));
  } catch {
    // Un lab sin manifiesto se publica igual: el catalogo ya trae lo esencial.
  }
  labs.push({ ...lab, manifest });
}

const CATEGORY = {
  platform: "Plataforma",
  starter: "Starter",
  infra: "Infraestructura",
};

/** Tecnologias distintas del catalogo, sin numeros de version. */
const stacks = new Set();
for (const lab of labs) {
  for (const part of lab.stack.split("+")) {
    const name = part.trim().replace(/\s+[\d.]+$/, "");
    if (name) stacks.add(name);
  }
}

// ── Salida ───────────────────────────────────────────────────────────────────

await rm(out, { recursive: true, force: true });
await mkdir(join(out, "docs"), { recursive: true });
await mkdir(join(out, "labs"), { recursive: true });
await mkdir(join(out, "guias"), { recursive: true });

// Documentacion tecnica: docs/*.md
const docFiles = (await readdir(join(root, "docs"))).filter((name) => name.endsWith(".md")).sort();
const docPages = [];
for (const name of docFiles) {
  const markdown = await readFile(join(root, "docs", name), "utf8");
  const slug = docSlug(name);
  const title = docTitle(markdown, slug);
  docPages.push({ name, slug, title, summary: docSummary(markdown), sitePath: `docs/${slug}.html` });
  await writeFile(
    join(out, "docs", `${slug}.html`),
    page({
      title: `${title} — docker-labs`,
      description: docSummary(markdown) || title,
      active: "docs/index.html",
      dir: "docs",
      body:
        `<nav class="crumbs"><a href="../index.html">Inicio</a> <span>›</span> ` +
        `<a href="index.html">Documentación</a> <span>›</span> <b>${escape(title)}</b></nav>` +
        `<article class="doc">${renderMarkdown(markdown, "docs", "docs")}</article>`,
    })
  );
}

// Guias del repositorio: los .md de la raiz.
const guideFiles = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();
const guidePages = [];
for (const name of guideFiles) {
  const markdown = await readFile(join(root, name), "utf8");
  const slug = docSlug(name);
  const title = docTitle(markdown, slug);
  guidePages.push({ name, slug, title, summary: docSummary(markdown), sitePath: `guias/${slug}.html` });
  await writeFile(
    join(out, "guias", `${slug}.html`),
    page({
      title: `${title} — docker-labs`,
      description: docSummary(markdown) || title,
      active: "guias/index.html",
      dir: "guias",
      body:
        `<nav class="crumbs"><a href="../index.html">Inicio</a> <span>›</span> ` +
        `<a href="index.html">Guías</a> <span>›</span> <b>${escape(title)}</b></nav>` +
        `<article class="doc">${renderMarkdown(markdown, "", "guias")}</article>`,
    })
  );
}

// Fichas de laboratorio: NN-*/README.md, con lo que declara su manifiesto.
for (const lab of labs) {
  const markdown = await readFile(join(root, lab.id, "README.md"), "utf8");
  const manifest = lab.manifest;
  const facts = [
    ["Stack", escape(lab.stack)],
    ["Puertos del host", lab.ports.map((port) => `<code>${port}</code>`).join(" ")],
    ["Memoria recomendada", `${lab.recommendedRamGb} GB`],
    ["Categoría", CATEGORY[lab.category] ?? lab.category],
    ["Entradas", lab.urls.map((entry) => `${escape(entry.label)}: <code>${escape(entry.url)}</code>`).join("<br>")],
    ["Health check", `<code>${escape(lab.healthUrl)}</code>`],
  ];
  if (manifest.systemRole) facts.unshift(["Rol en la plataforma", escape(manifest.systemRole)]);
  if (lab.portNotes) facts.push(["Nota de puertos", escape(lab.portNotes)]);

  const related = (manifest.relatedLabs ?? [])
    .filter((id) => labs.some((other) => other.id === id))
    .map((id) => `<a href="${id}.html">${escape(labs.find((other) => other.id === id).name)}</a>`)
    .join(" · ");
  if (related) facts.push(["Labs relacionados", related]);

  await writeFile(
    join(out, "labs", `${lab.id}.html`),
    page({
      title: `${lab.name} — docker-labs`,
      description: lab.description,
      active: "labs/index.html",
      dir: "labs",
      body:
        `<nav class="crumbs"><a href="../index.html">Inicio</a> <span>›</span> ` +
        `<a href="index.html">Laboratorios</a> <span>›</span> <b>${escape(lab.name)}</b></nav>` +
        `<section class="labfacts">` +
        `<h2>${escape(lab.name)} <span class="chip ${lab.category}">${CATEGORY[lab.category] ?? lab.category}</span></h2>` +
        `<p class="sub">${escape(lab.description)}</p>` +
        (manifest.goal ? `<p class="teaches"><b>Objetivo:</b> ${escape(manifest.goal)}</p>` : "") +
        `<dl>${facts.map(([term, value]) => `<dt>${term}</dt><dd>${value}</dd>`).join("")}</dl>` +
        (manifest.recommendedActions?.length
          ? `<h3>Qué hacer una vez levantado</h3><ul>${manifest.recommendedActions
              .map((action) => `<li>${escape(action)}</li>`)
              .join("")}</ul>`
          : "") +
        `<code class="cmd">docker compose -f ${lab.id}/docker-compose.yml up -d --build</code>` +
        `</section>` +
        `<article class="doc">${renderMarkdown(markdown, lab.id, "labs")}</article>`,
    })
  );
}

// ── Indices ──────────────────────────────────────────────────────────────────

const labCards = (dir) =>
  labs
    .map(
      (lab) => `<a class="card" href="${relativeHref(dir, `labs/${lab.id}.html`)}">
  <div class="card-top"><span class="num">${escape(lab.id)}</span><span class="chip ${lab.category}">${
        CATEGORY[lab.category] ?? lab.category
      }</span></div>
  <h3>${escape(lab.name)}</h3>
  <p>${escape(lab.description)}</p>
  <div class="meta"><span>${escape(lab.stack)}</span><span>${lab.recommendedRamGb} GB RAM</span>${lab.ports
        .map((port) => `<span>:${port}</span>`)
        .join("")}</div>
</a>`
    )
    .join("");

const cardList = (entries, dir) =>
  entries
    .map(
      (entry) => `<a class="card" href="${relativeHref(dir, entry.sitePath)}">
  <div class="card-top"><span class="num">${escape(entry.name)}</span></div>
  <h3>${escape(entry.title)}</h3>
  <p>${escape(entry.summary || "Documento del repositorio.")}</p>
</a>`
    )
    .join("");

await writeFile(
  join(out, "labs", "index.html"),
  page({
    title: "Los laboratorios — docker-labs",
    description: `Los ${labs.length} laboratorios Docker del repositorio, con su stack, sus puertos y la memoria que necesitan.`,
    active: "labs/index.html",
    dir: "labs",
    body:
      `<section class="hero small"><span class="eyebrow">${labs.length} entornos</span>` +
      `<h1>Los laboratorios</h1>` +
      `<p class="lead">Cada uno se levanta y se baja por su cuenta con <code>docker compose</code>. ` +
      `La ficha trae su stack, sus puertos, la memoria recomendada y qué hacer una vez arriba.</p></section>` +
      `<section><div class="grid">${labCards("labs")}</div></section>`,
  })
);

await writeFile(
  join(out, "docs", "index.html"),
  page({
    title: "Documentación técnica — docker-labs",
    description: "Arquitectura, instalación, especificaciones, despliegue y resolución de problemas de docker-labs.",
    active: "docs/index.html",
    dir: "docs",
    body:
      `<section class="hero small"><span class="eyebrow">${docPages.length} documentos</span>` +
      `<h1>Documentación técnica</h1>` +
      `<p class="lead">Todo lo que vive en <code>docs/</code> del repositorio, publicado como página web.</p></section>` +
      `<section><div class="grid">${cardList(docPages, "docs")}</div></section>`,
  })
);

await writeFile(
  join(out, "guias", "index.html"),
  page({
    title: "Guías del repositorio — docker-labs",
    description: "Estado del proyecto, changelog, contribución, seguridad y criterios de diseño de docker-labs.",
    active: "guias/index.html",
    dir: "guias",
    body:
      `<section class="hero small"><span class="eyebrow">${guidePages.length} documentos</span>` +
      `<h1>Guías del repositorio</h1>` +
      `<p class="lead">Los documentos de la raíz: estado real del proyecto, historial de cambios, ` +
      `cómo contribuir y qué enfoques se descartaron a propósito.</p></section>` +
      `<section><div class="grid">${cardList(guidePages, "guias")}</div></section>`,
  })
);

// ── Portada ──────────────────────────────────────────────────────────────────

// Las tarjetas destacadas se declaran por su ruta en el repositorio: si un
// documento se renombra, la portada falla al generarse en vez de publicar un
// enlace muerto.
const FEATURED = [
  "docs/BEGINNERS_GUIDE.md",
  "docs/USER_MANUAL.md",
  "docs/TECHNICAL_SPECS.md",
  "docs/windows-installer.md",
  "docs/KUBERNETES_DEPLOYMENT.md",
  "docs/AWS_MIGRATION.md",
];

const featured = FEATURED.map((repoPath) => {
  const sitePath = repoToSite(repoPath);
  const entry = [...docPages, ...guidePages].find((candidate) => candidate.sitePath === sitePath);
  if (!entry) throw new Error(`La portada destaca ${repoPath}, que ya no existe en el repositorio`);
  return entry;
});

const portada = (await readFile(join(root, "site-src", "index.html"), "utf8"))
  .replace("<!--LABS-->", labCards(""))
  .replace("<!--DOCS-->", cardList(featured, ""))
  .replace(/<!--LABS_COUNT-->/g, String(labs.length))
  // El Control Center no es un lab del catalogo: es el panel que gobierna al
  // resto. Se cuenta aparte para que la cifra cuadre con la del README.
  .replace(/<!--PLATFORM_COUNT-->/g, String(labs.filter((lab) => lab.category === "platform").length + 1))
  .replace(/<!--STACKS_COUNT-->/g, String(stacks.size))
  .replace(/<!--DOCS_COUNT-->/g, String(docPages.length + guidePages.length + labs.length))
  .replace(/<!--VERSION-->/g, version);

if (portada.includes("<!--")) {
  const pending = portada.match(/<!--[A-Z_]+-->/g) ?? [];
  throw new Error(`La portada quedó con marcadores sin sustituir: ${[...new Set(pending)].join(", ")}`);
}

await writeFile(join(out, "index.html"), page({
  title: "docker-labs — trece entornos Docker que se encienden cuando tú quieres",
  description:
    "Workspace Docker con panel de control propio: 12 laboratorios que se levantan y se bajan a voluntad, " +
    "y 4 servicios que funcionan juntos como una plataforma real.",
  body: portada,
}));

console.log(
  `✅ Sitio generado: portada, ${labs.length} fichas de lab, ${docPages.length} documentos técnicos ` +
    `y ${guidePages.length} guías · ${stacks.size} tecnologías · v${version}`
);
