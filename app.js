const ELEMENT_LIBRARY = [
  { tag: "html", label: "<html>", category: "Structure", explanation: "Root element that wraps an entire HTML page." },
  { tag: "head", label: "<head>", category: "Structure", explanation: "Contains metadata like title, links to CSS, and scripts." },
  { tag: "body", label: "<body>", category: "Structure", explanation: "Holds all visible content shown to users." },
  { tag: "header", label: "<header>", category: "Layout", explanation: "Top area for logo, title, or navigation." },
  { tag: "nav", label: "<nav>", category: "Layout", explanation: "Groups navigation links for moving around pages." },
  { tag: "main", label: "<main>", category: "Layout", explanation: "Main unique content of the page." },
  { tag: "section", label: "<section>", category: "Layout", explanation: "A thematic grouping of related content." },
  { tag: "article", label: "<article>", category: "Layout", explanation: "Independent content like blog posts or cards." },
  { tag: "aside", label: "<aside>", category: "Layout", explanation: "Side content such as tips, ads, or links." },
  { tag: "footer", label: "<footer>", category: "Layout", explanation: "Bottom area for credits, links, and copyright." },
  { tag: "h1", label: "<h1>", category: "Text", explanation: "Largest heading; page or section title." },
  { tag: "h2", label: "<h2>", category: "Text", explanation: "Second-level heading for major subsections." },
  { tag: "h3", label: "<h3>", category: "Text", explanation: "Third-level heading for smaller section titles." },
  { tag: "p", label: "<p>", category: "Text", explanation: "Paragraph text for writing explanations or stories." },
  { tag: "span", label: "<span>", category: "Text", explanation: "Inline container for styling little parts of text." },
  { tag: "strong", label: "<strong>", category: "Text", explanation: "Marks text as important (usually bold)." },
  { tag: "em", label: "<em>", category: "Text", explanation: "Gives stress emphasis (usually italic)." },
  { tag: "mark", label: "<mark>", category: "Text", explanation: "Highlights text with a marker effect." },
  { tag: "small", label: "<small>", category: "Text", explanation: "Shows smaller print text or fine details." },
  { tag: "blockquote", label: "<blockquote>", category: "Text", explanation: "For quoted sections from another source." },
  { tag: "code", label: "<code>", category: "Text", explanation: "Displays computer code snippets." },
  { tag: "pre", label: "<pre>", category: "Text", explanation: "Preserves spaces and line breaks in text." },
  { tag: "a", label: "<a>", category: "Media + Links", explanation: "Creates clickable links to pages or websites." },
  { tag: "img", label: "<img>", category: "Media + Links", explanation: "Displays images on the page." },
  { tag: "figure", label: "<figure>", category: "Media + Links", explanation: "Wraps media with optional caption." },
  { tag: "figcaption", label: "<figcaption>", category: "Media + Links", explanation: "Caption text for a figure." },
  { tag: "video", label: "<video>", category: "Media + Links", explanation: "Embeds video playback." },
  { tag: "audio", label: "<audio>", category: "Media + Links", explanation: "Embeds audio controls and playback." },
  { tag: "ul", label: "<ul>", category: "Lists", explanation: "Bulleted (unordered) list." },
  { tag: "ol", label: "<ol>", category: "Lists", explanation: "Numbered (ordered) list." },
  { tag: "li", label: "<li>", category: "Lists", explanation: "One item inside ul or ol lists." },
  { tag: "dl", label: "<dl>", category: "Lists", explanation: "Description list for terms and definitions." },
  { tag: "dt", label: "<dt>", category: "Lists", explanation: "Term name in a description list." },
  { tag: "dd", label: "<dd>", category: "Lists", explanation: "Definition details in a description list." },
  { tag: "table", label: "<table>", category: "Tables", explanation: "Grid layout for tabular data." },
  { tag: "thead", label: "<thead>", category: "Tables", explanation: "Header row group in a table." },
  { tag: "tbody", label: "<tbody>", category: "Tables", explanation: "Main body rows in a table." },
  { tag: "tr", label: "<tr>", category: "Tables", explanation: "A single table row." },
  { tag: "th", label: "<th>", category: "Tables", explanation: "Header cell inside a table row." },
  { tag: "td", label: "<td>", category: "Tables", explanation: "Data cell inside a table row." },
  { tag: "form", label: "<form>", category: "Forms", explanation: "Container for user input fields." },
  { tag: "label", label: "<label>", category: "Forms", explanation: "Names an input field for accessibility." },
  { tag: "input", label: "<input>", category: "Forms", explanation: "Single-line field for typing info." },
  { tag: "textarea", label: "<textarea>", category: "Forms", explanation: "Multi-line text input area." },
  { tag: "select", label: "<select>", category: "Forms", explanation: "Dropdown list of options." },
  { tag: "option", label: "<option>", category: "Forms", explanation: "One choice in a select dropdown." },
  { tag: "button", label: "<button>", category: "Forms", explanation: "Clickable button for actions." },
  { tag: "details", label: "<details>", category: "Interactive", explanation: "Expandable section users can open/close." },
  { tag: "summary", label: "<summary>", category: "Interactive", explanation: "Visible title line for a details element." },
  { tag: "progress", label: "<progress>", category: "Interactive", explanation: "Shows task progress visually." },
  { tag: "meter", label: "<meter>", category: "Interactive", explanation: "Displays a value within a known range." },
  { tag: "hr", label: "<hr>", category: "Other", explanation: "A horizontal divider between topics." },
  { tag: "br", label: "<br>", category: "Other", explanation: "Adds a line break in text." },
  { tag: "div", label: "<div>", category: "Other", explanation: "General-purpose block container." }
];

const SELF_CLOSING = new Set(["img", "input", "hr", "br"]);

const palette = document.getElementById("palette");
const dropZone = document.getElementById("dropZone");
const codeOutput = document.getElementById("codeOutput");
const previewFrame = document.getElementById("previewFrame");
const explanationBox = document.getElementById("explanationBox");
const clearCanvas = document.getElementById("clearCanvas");
const copyCode = document.getElementById("copyCode");

const canvasItems = [];
let draggedPaletteTag = null;
let dragCanvasIndex = null;

function createDefaults(tag) {
  const text = `Sample ${tag} content`;
  switch (tag) {
    case "a":
      return { attrs: { href: "https://example.com" }, text: "Visit example" };
    case "img":
      return { attrs: { src: "https://placehold.co/240x140", alt: "Placeholder image" }, text: "" };
    case "video":
      return { attrs: { controls: true, width: "220" }, text: "" };
    case "audio":
      return { attrs: { controls: true }, text: "" };
    case "input":
      return { attrs: { type: "text", placeholder: "Type here" }, text: "" };
    case "option":
      return { attrs: { value: "option-1" }, text: "Choice" };
    case "progress":
      return { attrs: { value: "45", max: "100" }, text: "45%" };
    case "meter":
      return { attrs: { value: "6", min: "0", max: "10" }, text: "6/10" };
    case "br":
    case "hr":
      return { attrs: {}, text: "" };
    default:
      return { attrs: {}, text };
  }
}

function renderPalette() {
  ELEMENT_LIBRARY.forEach((entry) => {
    const block = document.createElement("button");
    block.className = "block";
    block.draggable = true;
    block.type = "button";
    block.dataset.tag = entry.tag;
    block.textContent = entry.label;
    block.title = `${entry.category}: ${entry.explanation}`;

    block.addEventListener("dragstart", (event) => {
      draggedPaletteTag = entry.tag;
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", entry.tag);
    });

    block.addEventListener("mouseenter", () => showExplanation(entry));
    block.addEventListener("focus", () => showExplanation(entry));

    block.addEventListener("click", () => {
      addCanvasItem(entry.tag);
    });

    palette.appendChild(block);
  });
}

function showExplanation(entry) {
  explanationBox.innerHTML = `
    <h3>${entry.label} · ${entry.category}</h3>
    <p>${entry.explanation} This element is useful for beginner projects and appears instantly in code + preview.</p>
  `;
}

function addCanvasItem(tag, index = canvasItems.length) {
  const libraryEntry = ELEMENT_LIBRARY.find((item) => item.tag === tag);
  if (!libraryEntry) {
    return;
  }

  const defaults = createDefaults(tag);
  const item = {
    id: `${tag}-${crypto.randomUUID().slice(0, 8)}`,
    tag,
    label: libraryEntry.label,
    explanation: libraryEntry.explanation,
    attrs: defaults.attrs,
    text: defaults.text
  };

  canvasItems.splice(index, 0, item);
  renderCanvas();
  refreshOutput();
}

function removeCanvasItem(index) {
  canvasItems.splice(index, 1);
  renderCanvas();
  refreshOutput();
}

function moveCanvasItem(from, to) {
  if (from === to || to < 0 || to >= canvasItems.length) {
    return;
  }

  const [moved] = canvasItems.splice(from, 1);
  canvasItems.splice(to, 0, moved);
  renderCanvas();
  refreshOutput();
}

function renderCanvas() {
  dropZone.innerHTML = "";

  if (!canvasItems.length) {
    const empty = document.createElement("p");
    empty.className = "canvas-empty";
    empty.textContent = "Drop HTML blocks here to build your page!";
    dropZone.appendChild(empty);
    return;
  }

  canvasItems.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "canvas-item";
    card.draggable = true;
    card.dataset.index = String(index);

    card.innerHTML = `
      <div>
        <p class="canvas-title">${item.label}</p>
        <small>${item.explanation}</small>
      </div>
      <div class="canvas-controls">
        <button class="icon-btn" data-action="up" title="Move up">↑</button>
        <button class="icon-btn" data-action="down" title="Move down">↓</button>
        <button class="icon-btn" data-action="delete" title="Delete">✕</button>
      </div>
    `;

    card.addEventListener("dragstart", () => {
      dragCanvasIndex = index;
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      dragCanvasIndex = null;
      card.classList.remove("dragging");
    });

    card.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (dragCanvasIndex !== null) {
        event.dataTransfer.dropEffect = "move";
      }
    });

    card.addEventListener("drop", (event) => {
      event.preventDefault();
      if (dragCanvasIndex !== null) {
        moveCanvasItem(dragCanvasIndex, index);
      }
    });

    card.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (action === "delete") {
        removeCanvasItem(index);
      } else if (action === "up") {
        moveCanvasItem(index, index - 1);
      } else if (action === "down") {
        moveCanvasItem(index, index + 1);
      } else {
        showExplanation({ label: item.label, category: "Canvas", explanation: item.explanation });
      }
    });

    dropZone.appendChild(card);
  });
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }
      return `${key}="${String(value).replaceAll('"', "&quot;")}"`;
    })
    .join(" ");
}

function generateHtmlCode() {
  if (!canvasItems.length) {
    return "<!-- Drag blocks into the canvas to generate HTML -->";
  }

  return canvasItems
    .map((item) => {
      const attrs = attrsToString(item.attrs);
      const attrSegment = attrs ? ` ${attrs}` : "";

      if (SELF_CLOSING.has(item.tag)) {
        return `<${item.tag}${attrSegment} />`;
      }

      return `<${item.tag}${attrSegment}>${item.text}</${item.tag}>`;
    })
    .join("\n");
}

function escapeHtml(raw) {
  return raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function highlightHtml(html) {
  const safe = escapeHtml(html);
  return safe.replace(/(&lt;\/?)([a-z0-9-]+)([^&]*?)(\/?&gt;)/gi, (match, open, tag, rest, close) => {
    const tail = rest.trim() ? `<span class="token-text">${rest}</span>` : "";
    return `<span class="token-angle">${open}</span><span class="token-tag">${tag}</span>${tail}<span class="token-angle">${close}</span>`;
  });
}

function refreshOutput() {
  const html = generateHtmlCode();
  codeOutput.innerHTML = highlightHtml(html);
  previewFrame.srcdoc = `
    <!doctype html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 12px;
            line-height: 1.4;
          }
          img, video, iframe {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}

function setupDropZone() {
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");

    const droppedTag = event.dataTransfer.getData("text/plain") || draggedPaletteTag;
    if (droppedTag) {
      addCanvasItem(droppedTag);
    }
  });
}

clearCanvas.addEventListener("click", () => {
  canvasItems.length = 0;
  renderCanvas();
  refreshOutput();
});

copyCode.addEventListener("click", async () => {
  const html = generateHtmlCode();

  try {
    await navigator.clipboard.writeText(html);
    copyCode.textContent = "Copied!";
    setTimeout(() => {
      copyCode.textContent = "Copy HTML";
    }, 1200);
  } catch {
    copyCode.textContent = "Copy blocked";
    setTimeout(() => {
      copyCode.textContent = "Copy HTML";
    }, 1200);
  }
});

renderPalette();
renderCanvas();
setupDropZone();
refreshOutput();
