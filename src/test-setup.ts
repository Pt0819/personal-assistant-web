import "@testing-library/jest-dom/vitest";

// Mock matchMedia for jsdom (not implemented by default)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Suppress specific console errors in test output when desired
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const suppressedPatterns = [
    "ReactDOMTestUtils.act",
    "inside a test was not wrapped in act",
  ];
  const message = typeof args[0] === "string" ? args[0] : "";
  if (suppressedPatterns.some((pattern) => message.includes(pattern))) {
    return;
  }
  originalError.call(console, ...args);
};
