const ELEMENT_LIBRARY = [
  { tag: "div", label: "<div>", category: "Container", explanation: "General block container for grouping content." },
  { tag: "header", label: "<header>", category: "Layout", explanation: "Top area for logo, heading, or nav." },
  { tag: "nav", label: "<nav>", category: "Layout", explanation: "Container for navigation links." },
  { tag: "main", label: "<main>", category: "Layout", explanation: "Main page content container." },
  { tag: "section", label: "<section>", category: "Layout", explanation: "Groups related content by topic." },
  { tag: "article", label: "<article>", category: "Layout", explanation: "Self-contained content block." },
  { tag: "aside", label: "<aside>", category: "Layout", explanation: "Side info such as tips or callouts." },
  { tag: "footer", label: "<footer>", category: "Layout", explanation: "Bottom area for footnotes and links." },
  { tag: "h1", label: "<h1>", category: "Text", explanation: "Largest heading." },
  { tag: "h2", label: "<h2>", category: "Text", explanation: "Second-level heading." },
  { tag: "p", label: "<p>", category: "Text", explanation: "Paragraph for regular text." },
  { tag: "span", label: "<span>", category: "Text", explanation: "Inline text wrapper." },
  { tag: "strong", label: "<strong>", category: "Text", explanation: "Important text emphasis." },
  { tag: "em", label: "<em>", category: "Text", explanation: "Stressed text emphasis." },
  { tag: "ul", label: "<ul>", category: "Lists", explanation: "Bulleted list container." },
  { tag: "ol", label: "<ol>", category: "Lists", explanation: "Numbered list container." },
  { tag: "li", label: "<li>", category: "Lists", explanation: "List item." },
  { tag: "a", label: "<a>", category: "Media + Links", explanation: "Clickable hyperlink." },
  { tag: "img", label: "<img>", category: "Media + Links", explanation: "Embeds an image." },
  { tag: "button", label: "<button>", category: "Forms", explanation: "Clickable action button." },
  { tag: "form", label: "<form>", category: "Forms", explanation: "Wraps form fields." },
  { tag: "label", label: "<label>", category: "Forms", explanation: "Describes an input field." },
  { tag: "input", label: "<input>", category: "Forms", explanation: "Single-line text field." },
  { tag: "table", label: "<table>", category: "Tables", explanation: "Container for table rows/cells." },
  { tag: "thead", label: "<thead>", category: "Tables", explanation: "Table header rows." },
  { tag: "tbody", label: "<tbody>", category: "Tables", explanation: "Table body rows." },
  { tag: "tr", label: "<tr>", category: "Tables", explanation: "Table row." },
  { tag: "th", label: "<th>", category: "Tables", explanation: "Header cell." },
  { tag: "td", label: "<td>", category: "Tables", explanation: "Data cell." },
  { tag: "hr", label: "<hr>", category: "Other", explanation: "Horizontal divider." },
  { tag: "br", label: "<br>", category: "Other", explanation: "Line break." }
];

const LAYOUT_LIBRARY = [
  {
    id: "single-column",
    name: "Single Column",
    explanation: "A simple wrapper with one area for children.",
    create: () => [node("div", { attrs: { class: "layout-single" }, text: "" })]
  },
  {
    id: "hero-layout",
    name: "Hero + Content + Footer",
    explanation: "Great starter page structure with header/main/footer.",
    create: () => [node("header"), node("main"), node("footer")]
  },
  {
    id: "two-columns",
    name: "Two Columns",
    explanation: "A row with two side-by-side div areas.",
    create: () => [
      node("div", {
        attrs: { class: "layout-two-col" },
        children: [
          node("div", { attrs: { class: "left-col" }, text: "" }),
          node("div", { attrs: { class: "right-col" }, text: "" })
        ]
      })
    ]
  },
  {
    id: "article-sidebar",
    name: "Article + Sidebar",
    explanation: "Main article with an aside for side content.",
    create: () => [node("main", { children: [node("article"), node("aside")] })]
  },
  {
    id: "table-starter",
    name: "Table Starter",
    explanation: "Starter table with tbody > tr > td nesting.",
    create: () => [
      node("table", {
        children: [
          node("tbody", {
            children: [node("tr", { children: [node("td", { text: "Cell" }), node("td", { text: "Cell" })] })]
          })
        ]
      })
    ]
  }
];

const SELF_CLOSING = new Set(["img", "input", "hr", "br"]);
const CAN_HAVE_CHILDREN = new Set([
  "div", "header", "nav", "main", "section", "article", "aside", "footer",
  "ul", "ol", "li", "form", "table", "thead", "tbody", "tr"
]);

const ALLOWED_CHILDREN = {
  table: ["thead", "tbody", "tr"],
  thead: ["tr"],
  tbody: ["tr"],
  tr: ["th", "td"],
  ul: ["li"],
  ol: ["li"],
  li: ["span", "strong", "em", "a", "br", "img", "button", "p", "div"],
  form: ["label", "input", "button", "div", "p"],
  label: ["span", "strong", "em"]
};

const layoutPalette = document.getElementById("layoutPalette");
const elementPalette = document.getElementById("elementPalette");
const dropZone = document.getElementById("dropZone");
const codeOutput = document.getElementById("codeOutput");
const previewFrame = document.getElementById("previewFrame");
const explanationBox = document.getElementById("explanationBox");
const clearCanvas = document.getElementById("clearCanvas");
const copyCode = document.getElementById("copyCode");

const rootNodes = [];
let currentDrag = null;

function node(tag, options = {}) {
  return {
    id: `${tag}-${crypto.randomUUID().slice(0, 8)}`,
    tag,
    attrs: options.attrs || defaultAttrs(tag),
    text: options.text ?? defaultText(tag),
    children: options.children || []
  };
}

function cloneNodes(nodes) {
  return nodes.map((n) => ({ ...n, children: cloneNodes(n.children || []) }));
}

function defaultText(tag) {
  const map = {
    h1: "Big heading",
    h2: "Section heading",
    p: "Write your awesome text here!",
    span: "small text",
    strong: "important",
    em: "emphasis",
    li: "list item",
    a: "Visit page",
    button: "Click me",
    label: "Your name",
    td: "cell",
    th: "heading"
  };
  return map[tag] || "";
}

function defaultAttrs(tag) {
  if (tag === "a") return { href: "https://example.com" };
  if (tag === "img") return { src: "https://placehold.co/200x120", alt: "Placeholder" };
  if (tag === "input") return { type: "text", placeholder: "Type here" };
  return {};
}

function describe(tag) {
  return ELEMENT_LIBRARY.find((e) => e.tag === tag)?.explanation || "HTML element";
}

function canAcceptChild(parentTag, childTag) {
  if (!CAN_HAVE_CHILDREN.has(parentTag)) return false;
  const strict = ALLOWED_CHILDREN[parentTag];
  if (!strict) return true;
  return strict.includes(childTag);
}

function renderPalettes() {
  LAYOUT_LIBRARY.forEach((layout) => {
    const btn = document.createElement("button");
    btn.className = "block layout-block";
    btn.type = "button";
    btn.draggable = true;
    btn.textContent = layout.name;
    btn.title = layout.explanation;
    btn.addEventListener("mouseenter", () => showExplanation(layout.name, layout.explanation, "Layout"));
    btn.addEventListener("dragstart", (event) => {
      currentDrag = { kind: "layout", id: layout.id };
      event.dataTransfer.setData("text/plain", JSON.stringify(currentDrag));
    });
    btn.addEventListener("click", () => addLayout(layout.id));
    layoutPalette.appendChild(btn);
  });

  ELEMENT_LIBRARY.forEach((entry) => {
    const btn = document.createElement("button");
    btn.className = "block";
    btn.type = "button";
    btn.draggable = true;
    btn.textContent = entry.label;
    btn.title = `${entry.category}: ${entry.explanation}`;
    btn.addEventListener("mouseenter", () => showExplanation(entry.label, entry.explanation, entry.category));
    btn.addEventListener("dragstart", (event) => {
      currentDrag = { kind: "element", tag: entry.tag };
      event.dataTransfer.setData("text/plain", JSON.stringify(currentDrag));
    });
    btn.addEventListener("click", () => addElementToRoot(entry.tag));
    elementPalette.appendChild(btn);
  });
}

function showExplanation(title, explanation, category) {
  explanationBox.innerHTML = `<h3>${title} · ${category}</h3><p>${explanation}</p>`;
}

function addLayout(layoutId) {
  const layout = LAYOUT_LIBRARY.find((item) => item.id === layoutId);
  if (!layout) return;
  rootNodes.push(...cloneNodes(layout.create()));
  renderCanvas();
  refreshOutput();
}

function addElementToRoot(tag) {
  rootNodes.push(node(tag));
  renderCanvas();
  refreshOutput();
}

function findNodeById(targetId, list = rootNodes, parent = null) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.id === targetId) return { node: item, siblings: list, index: i, parent };
    const found = findNodeById(targetId, item.children, item);
    if (found) return found;
  }
  return null;
}

function removeNode(nodeId) {
  const found = findNodeById(nodeId);
  if (!found) return;
  found.siblings.splice(found.index, 1);
  renderCanvas();
  refreshOutput();
}

function moveSibling(nodeId, direction) {
  const found = findNodeById(nodeId);
  if (!found) return;
  const nextIndex = found.index + direction;
  if (nextIndex < 0 || nextIndex >= found.siblings.length) return;
  const [item] = found.siblings.splice(found.index, 1);
  found.siblings.splice(nextIndex, 0, item);
  renderCanvas();
  refreshOutput();
}

function handleDropPayload(raw, targetChildren, parentTag = null) {
  if (!raw) return;
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = currentDrag;
  }

  if (!payload) return;

  if (payload.kind === "layout") {
    const layout = LAYOUT_LIBRARY.find((item) => item.id === payload.id);
    if (!layout) return;
    if (parentTag) {
      showExplanation("Layout blocked", "Layouts can only be dropped at the canvas root.", "Rule");
      return;
    }
    targetChildren.push(...cloneNodes(layout.create()));
  }

  if (payload.kind === "element") {
    if (parentTag && !canAcceptChild(parentTag, payload.tag)) {
      showExplanation("Nesting rule", `<${payload.tag}> cannot go directly inside <${parentTag}>. Try a different parent.`, "Rule");
      return;
    }
    targetChildren.push(node(payload.tag));
  }

  renderCanvas();
  refreshOutput();
}

function makeDropArea(targetChildren, parentTag = null) {
  const zone = document.createElement("div");
  zone.className = "children-zone";

  if (!targetChildren.length) {
    const hint = document.createElement("p");
    hint.className = "slot-hint";
    hint.textContent = parentTag ? `Drop children inside <${parentTag}>` : "Drop a layout or element here";
    zone.appendChild(hint);
  }

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    handleDropPayload(event.dataTransfer.getData("text/plain"), targetChildren, parentTag);
  });

  return zone;
}

function renderNode(nodeData, depth = 0) {
  const card = document.createElement("article");
  card.className = "canvas-node";
  card.style.marginLeft = `${depth * 14}px`;

  const header = document.createElement("div");
  header.className = "canvas-header";

  const title = document.createElement("p");
  title.className = "canvas-title";
  title.textContent = `<${nodeData.tag}>`;

  const controls = document.createElement("div");
  controls.className = "canvas-controls";
  controls.innerHTML = `
    <button class="icon-btn" data-action="up" title="Move up">↑</button>
    <button class="icon-btn" data-action="down" title="Move down">↓</button>
    <button class="icon-btn" data-action="delete" title="Delete">✕</button>
  `;

  controls.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (action === "delete") removeNode(nodeData.id);
    if (action === "up") moveSibling(nodeData.id, -1);
    if (action === "down") moveSibling(nodeData.id, 1);
  });

  title.addEventListener("mouseenter", () => showExplanation(`<${nodeData.tag}>`, describe(nodeData.tag), "Canvas"));

  header.appendChild(title);
  header.appendChild(controls);
  card.appendChild(header);

  if (CAN_HAVE_CHILDREN.has(nodeData.tag)) {
    const childZone = makeDropArea(nodeData.children, nodeData.tag);
    nodeData.children.forEach((child) => childZone.appendChild(renderNode(child, depth + 1)));
    card.appendChild(childZone);
  }

  return card;
}

function renderCanvas() {
  dropZone.innerHTML = "";

  if (!rootNodes.length) {
    const empty = document.createElement("p");
    empty.className = "canvas-empty";
    empty.textContent = "Drop one of the 5 layout blocks here, then add elements into layout spaces!";
    dropZone.appendChild(empty);
  }

  const rootDrop = makeDropArea(rootNodes);
  rootNodes.forEach((nodeData) => rootDrop.appendChild(renderNode(nodeData)));
  dropZone.appendChild(rootDrop);
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .map(([key, value]) => (value === true ? key : `${key}="${String(value).replaceAll('"', "&quot;")}"`))
    .join(" ");
}

function renderNodeHtml(nodeData, indent = 0) {
  const pad = "  ".repeat(indent);
  const attrs = attrsToString(nodeData.attrs);
  const attrPart = attrs ? ` ${attrs}` : "";
  const comment = `${pad}<!-- ${nodeData.tag} element -->`;

  if (SELF_CLOSING.has(nodeData.tag)) {
    return `${comment}\n${pad}<${nodeData.tag}${attrPart} />`;
  }

  if (!nodeData.children.length) {
    return `${comment}\n${pad}<${nodeData.tag}${attrPart}>${nodeData.text}</${nodeData.tag}>`;
  }

  const childrenHtml = nodeData.children.map((child) => renderNodeHtml(child, indent + 1)).join("\n");
  return `${comment}\n${pad}<${nodeData.tag}${attrPart}>\n${childrenHtml}\n${pad}</${nodeData.tag}>`;
}

function generateHtmlCode() {
  if (!rootNodes.length) return "<!-- Drag a layout block into the canvas to generate HTML -->";
  return rootNodes.map((n) => renderNodeHtml(n)).join("\n");
}

function escapeHtml(raw) {
  return raw.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function highlightHtml(html) {
  const safe = escapeHtml(html);
  return safe
    .replace(/(&lt;!--.*?--&gt;)/g, '<span class="token-comment">$1</span>')
    .replace(/(&lt;\/?)([a-z0-9-]+)([^&]*?)(\/?&gt;)/gi, (match, open, tag, rest, close) => {
      const tail = rest.trim() ? `<span class="token-text">${rest}</span>` : "";
      return `<span class="token-angle">${open}</span><span class="token-tag">${tag}</span>${tail}<span class="token-angle">${close}</span>`;
    });
}

function refreshOutput() {
  const html = generateHtmlCode();
  codeOutput.innerHTML = highlightHtml(html);
  previewFrame.srcdoc = `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:12px;line-height:1.4;">${html}</body></html>`;
}

clearCanvas.addEventListener("click", () => {
  rootNodes.length = 0;
  renderCanvas();
  refreshOutput();
});

copyCode.addEventListener("click", async () => {
  const html = generateHtmlCode();
  try {
    await navigator.clipboard.writeText(html);
    copyCode.textContent = "Copied!";
  } catch {
    copyCode.textContent = "Copy blocked";
  }
  setTimeout(() => {
    copyCode.textContent = "Copy HTML";
  }, 1200);
});

renderPalettes();
renderCanvas();
refreshOutput();
