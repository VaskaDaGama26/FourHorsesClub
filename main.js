// DEBUG FLAG – Define FALSE in Production
const DEBUG = false;

const app = document.getElementById("app");

const loadComponent = async (name) => {
  // Load HTML Files
  const html = await fetch(`./components/${name}/${name}.html`).then((res) =>
    res.text()
  );
  if (DEBUG) {
    console.log("HTML:", html);
  }

  // Load CSS files
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href = `components/${name}/${name}.css`;
  document.head.appendChild(cssLink);

  // Create wrapper for HTML files
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const element = wrapper.firstElementChild;
  if (DEBUG) {
    console.log("Element:", element);
  }

  // Load JS, if exists
  try {
    const module = await import(`./components/${name}/${name}.js`);
    if (typeof module.init === "function") {
      module.init(element);
    }
  } catch (error) {
    if (DEBUG) {
      console.warn(`⚠️ JS-файл для компонента "${name}" не найден:`, error);
    }
  }
  return element;
};

// Render Components
async function initApp() {
  const components = [
    "HeroSection",
    "Marquee",
    "InfoSection",
    "StagesSection",
    "MembersSection",
    "Marquee",
    "Footer",
  ];

  const loadPromises = components.map((name) => loadComponent(name));
  const elements = await Promise.all(loadPromises);

  for (const el of elements) {
    app.appendChild(el);
  }
}

initApp();
