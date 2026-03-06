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
const codeEditor = document.getElementById("codeEditor");
const codeViewWrap = document.getElementById("codeView");
const codeEditWrap = document.getElementById("codeEdit");
const showCodeViewBtn = document.getElementById("showCodeView");
const showCodeEditBtn = document.getElementById("showCodeEdit");
const previewFrame = document.getElementById("previewFrame");
const explanationBox = document.getElementById("explanationBox");
const clearCanvas = document.getElementById("clearCanvas");
const copyCode = document.getElementById("copyCode");
const showCanvasBtn = document.getElementById("showCanvas");
const showRenderBtn = document.getElementById("showRender");
const canvasView = document.getElementById("canvasView");
const renderView = document.getElementById("renderView");
// Style panel controls
const styleColor = document.getElementById("styleColor");
const styleBg = document.getElementById("styleBg");
const stylePadding = document.getElementById("stylePadding");
const styleMargin = document.getElementById("styleMargin");
const styleFontSize = document.getElementById("styleFontSize");
const clearStylesBtn = document.getElementById("clearStyles");
const styleBorderWidth = document.getElementById("styleBorderWidth");
const styleBorderStyle = document.getElementById("styleBorderStyle");
const styleBorderColor = document.getElementById("styleBorderColor");
const styleRaw = document.getElementById("styleRaw");

const rootNodes = [];
let currentDrag = null;
let selectedNodeId = null;

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
    // Click-to-add disabled for elements; drag only
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

  if (payload.kind === "move") {
    const moving = findNodeById(payload.id);
    if (!moving) return;
    if (parentTag && !canAcceptChild(parentTag, moving.node.tag)) return;
    // Prevent moving a node into itself or its subtree
    if (moving.node.id === payload.targetId) return;
    // Remove from old position
    const [item] = moving.siblings.splice(moving.index, 1);
    // Append to target list
    targetChildren.push(item);
  }

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
  if (!parentTag) zone.classList.add("root-drop");

  if (!targetChildren.length) {
    const hint = document.createElement("p");
    hint.className = "slot-hint";
    hint.textContent = parentTag ? `Drop children inside <${parentTag}>` : "Drop a layout or element anywhere in the canvas";
    zone.appendChild(hint);
  }

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drag-over");
    event.stopPropagation();
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    event.stopPropagation();
    handleDropPayload(event.dataTransfer.getData("text/plain"), targetChildren, parentTag);
  });

  return zone;
}

function renderNode(nodeData, depth = 0) {
  const card = document.createElement("article");
  card.className = "canvas-node";
  card.style.marginLeft = `${depth * 14}px`;
  if (nodeData.id === selectedNodeId) {
    card.classList.add("selected");
  }

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
  card.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedNodeId = nodeData.id;
    renderCanvas();
    refreshOutput();
    updateStylePanel();
  });

  // Drag handle for moving this node among siblings (keeps children)
  header.draggable = true;
  header.addEventListener("dragstart", (event) => {
    currentDrag = { kind: "move", id: nodeData.id };
    event.dataTransfer.setData("text/plain", JSON.stringify(currentDrag));
    event.stopPropagation();
  });
  header.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedNodeId = nodeData.id;
    renderCanvas();
    refreshOutput();
    updateStylePanel();
  });

  // Allow dropping another node before this one (sibling reorder)
  card.addEventListener("dragover", (event) => {
    // Only for move operations
    if (!currentDrag || currentDrag.kind !== "move") return;
    event.preventDefault();
  });
  card.addEventListener("drop", (event) => {
    const raw = event.dataTransfer.getData("text/plain");
    let payload;
    try { payload = JSON.parse(raw); } catch { payload = currentDrag; }
    if (!payload || payload.kind !== "move") return;
    event.preventDefault();
    event.stopPropagation();
    const moving = findNodeById(payload.id);
    const target = findNodeById(nodeData.id);
    if (!moving || !target) return;
    // Prevent self-drop
    if (moving.node.id === target.node.id) return;
    // Remove from old position
    const [item] = moving.siblings.splice(moving.index, 1);
    // Insert before target in same siblings list
    const where = target.siblings === moving.siblings ? target.index : target.index;
    target.siblings.splice(where, 0, item);
    renderCanvas();
    refreshOutput();
  });

  header.appendChild(title);
  header.appendChild(controls);
  card.appendChild(header);

  // Inline text editing for leaf nodes
  if (!SELF_CLOSING.has(nodeData.tag) && nodeData.children.length === 0) {
    const textBox = document.createElement("div");
    textBox.className = "text-editor";
    textBox.contentEditable = "true";
    textBox.textContent = nodeData.text || "";
    // Avoid starting a drag while editing
    textBox.addEventListener("mousedown", (e) => e.stopPropagation());
    textBox.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    textBox.addEventListener("focus", () => {
      // Update selection without re-render to keep caret
      selectedNodeId = nodeData.id;
      const prev = document.querySelectorAll(".canvas-node.selected");
      prev.forEach((el) => el.classList.remove("selected"));
      card.classList.add("selected");
      updateStylePanel();
    });
    textBox.addEventListener("input", () => {
      nodeData.text = textBox.textContent;
      refreshOutput();
    });
    card.appendChild(textBox);
  }

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
  if (selectedNodeId) {
    const selected = dropZone.querySelector(".canvas-node.selected .text-editor");
    if (selected) {
      selected.focus();
      const r = document.createRange();
      r.selectNodeContents(selected);
      r.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }
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
  if (codeOutput) codeOutput.innerHTML = highlightHtml(html);
  if (codeEditor && !codeEditWrap.hidden) codeEditor.value = html;
  if (previewFrame) {
    previewFrame.srcdoc = `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:12px;line-height:1.4;">${html}</body></html>`;
  }
}

function buildNodeFromEl(el) {
  const tag = el.tagName.toLowerCase();
  const attrs = {};
  for (const a of el.attributes) {
    attrs[a.name] = a.value;
  }
  const elementChildren = Array.from(el.childNodes).filter((n) => n.nodeType === 1);
  const textNodes = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.textContent.trim().length);
  const children = elementChildren.map((child) => buildNodeFromEl(child));
  const text = children.length ? "" : (textNodes.map((n) => n.textContent).join("").trim() || defaultText(tag));
  return {
    id: `${tag}-${crypto.randomUUID().slice(0, 8)}`,
    tag,
    attrs,
    text,
    children
  };
}

function parseHtmlToNodes(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;
  const elements = Array.from(body.childNodes).filter((n) => n.nodeType === 1);
  return elements.map((el) => buildNodeFromEl(el));
}

function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function parseInlineStyle(styleStr = "") {
  return styleStr.split(";").map(s => s.trim()).filter(Boolean).reduce((acc, pair) => {
    const idx = pair.indexOf(":");
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const value = pair.slice(idx + 1).trim();
      acc[key] = value;
    }
    return acc;
  }, {});
}

function styleToString(obj) {
  return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join("; ");
}

function updateStylePanel() {
  if (!selectedNodeId) return;
  const found = findNodeById(selectedNodeId);
  if (!found) return;
  const styles = parseInlineStyle(found.node.attrs.style || "");
  if (styleColor) styleColor.value = styles.color ? rgbOrHex(styles.color) : "#000000";
  if (styleBg) styleBg.value = styles["background"] || styles["background-color"] ? rgbOrHex(styles["background"] || styles["background-color"]) : "#ffffff";
  if (styleFontSize) styleFontSize.value = styles["font-size"] || "";
  if (stylePadding) stylePadding.value = styles.padding || "";
  if (styleMargin) styleMargin.value = styles.margin || "";
  if (styleBorderWidth) styleBorderWidth.value = styles["border-width"] || "";
  if (styleBorderStyle) styleBorderStyle.value = styles["border-style"] || "";
  if (styleBorderColor) styleBorderColor.value = styles["border-color"] ? rgbOrHex(styles["border-color"]) : "#000000";
  if (styleRaw) styleRaw.value = found.node.attrs.style || "";
}

function rgbOrHex(v) {
  // Best effort: browsers may return rgb(), keep as is if not hex-compatible
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : v;
}

function setStyleOnSelected(prop, value) {
  if (!selectedNodeId) {
    showExplanation("No element selected", "Click a canvas card to apply styles.", "Styles");
    return;
  }
  const found = findNodeById(selectedNodeId);
  if (!found) return;
  const styles = parseInlineStyle(found.node.attrs.style || "");
  if (value) styles[prop] = value;
  else delete styles[prop];
  found.node.attrs.style = styleToString(styles);
  refreshOutput();
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

// View toggle handlers
if (showCanvasBtn && showRenderBtn && canvasView && renderView) {
  const activate = (which) => {
    const isCanvas = which === "canvas";
    showCanvasBtn.classList.toggle("active", isCanvas);
    showRenderBtn.classList.toggle("active", !isCanvas);
    canvasView.hidden = !isCanvas;
    renderView.hidden = isCanvas;
    if (!isCanvas) refreshOutput();
  };
  showCanvasBtn.addEventListener("click", () => activate("canvas"));
  showRenderBtn.addEventListener("click", () => activate("render"));
}

if (showCodeViewBtn && showCodeEditBtn && codeViewWrap && codeEditWrap) {
  const activate = (mode) => {
    const isView = mode === "view";
    showCodeViewBtn.classList.toggle("active", isView);
    showCodeEditBtn.classList.toggle("active", !isView);
    codeViewWrap.hidden = !isView;
    codeEditWrap.hidden = isView;
    if (isView) {
      refreshOutput();
    } else if (codeEditor) {
      codeEditor.value = generateHtmlCode();
    }
  };
  showCodeViewBtn.addEventListener("click", () => activate("view"));
  showCodeEditBtn.addEventListener("click", () => activate("edit"));
}

if (codeEditor) {
  const syncFromEditor = debounce(() => {
    try {
      const nodes = parseHtmlToNodes(codeEditor.value || "");
      rootNodes.length = 0;
      nodes.forEach((n) => rootNodes.push(n));
      renderCanvas();
      refreshOutput();
    } catch {
      /* ignore parse errors while typing */
    }
  }, 300);
  codeEditor.addEventListener("input", syncFromEditor);
  codeEditor.addEventListener("blur", syncFromEditor);
}

// Styles panel interactions
if (clearStylesBtn) {
  clearStylesBtn.addEventListener("click", () => {
    if (!selectedNodeId) return;
    const found = findNodeById(selectedNodeId);
    if (!found) return;
    delete found.node.attrs.style;
    updateStylePanel();
    refreshOutput();
  });
}
if (styleColor) {
  styleColor.addEventListener("input", () => setStyleOnSelected("color", styleColor.value));
  styleColor.addEventListener("change", () => styleColor.blur());
}
if (styleBg) {
  styleBg.addEventListener("input", () => setStyleOnSelected("background-color", styleBg.value));
  styleBg.addEventListener("change", () => styleBg.blur());
}
if (styleFontSize) styleFontSize.addEventListener("input", () => setStyleOnSelected("font-size", styleFontSize.value));
if (stylePadding) stylePadding.addEventListener("input", () => setStyleOnSelected("padding", stylePadding.value));
if (styleMargin) styleMargin.addEventListener("input", () => setStyleOnSelected("margin", styleMargin.value));
  if (styleBorderWidth) styleBorderWidth.addEventListener("input", () => setStyleOnSelected("border-width", styleBorderWidth.value));
  if (styleBorderStyle) styleBorderStyle.addEventListener("change", () => setStyleOnSelected("border-style", styleBorderStyle.value));
  if (styleBorderColor) {
    styleBorderColor.addEventListener("input", () => setStyleOnSelected("border-color", styleBorderColor.value));
    styleBorderColor.addEventListener("change", () => styleBorderColor.blur());
  }
  if (styleRaw) {
    const syncRaw = debounce(() => {
      if (!selectedNodeId) return;
      const found = findNodeById(selectedNodeId);
      if (!found) return;
      const raw = styleRaw.value || "";
      found.node.attrs.style = raw;
      refreshOutput();
    }, 200);
    styleRaw.addEventListener("input", syncRaw);
    styleRaw.addEventListener("blur", syncRaw);
  }
  document.addEventListener("click", (e) => {
    if (e.target !== styleColor) styleColor && styleColor.blur();
    if (e.target !== styleBg) styleBg && styleBg.blur();
    if (e.target !== styleBorderColor) styleBorderColor && styleBorderColor.blur();
  });

renderPalettes();
renderCanvas();
refreshOutput();
