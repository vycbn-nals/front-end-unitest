import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('main.ts', () => {
  let appDiv: HTMLDivElement;
  let counterButton: HTMLButtonElement;

  beforeEach(() => {
    // Set up the DOM structure
    document.body.innerHTML = `
      <div id="app"></div>
    `;
    appDiv = document.querySelector<HTMLDivElement>('#app')!;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('should render the app content on window load', async () => {
    // Mock window.onload
    const onload = vi.fn();
    Object.defineProperty(window, 'onload', {
      writable: true,
      value: onload,
    });

    // Import the main.ts file to trigger the onload function
    await import('../main');

    // Trigger the onload function
    window.onload!({} as Event);

    expect(appDiv.innerHTML).toContain('<h1>Vite + TypeScript</h1>');
    expect(appDiv.innerHTML).toContain('Click on the Vite and TypeScript logos to learn more');
  });

  it('should set up the counter button', async () => {
    // Import the main.ts file
    await import('../main');

    // Trigger the onload function
    window.onload!({} as Event);

    counterButton = document.querySelector<HTMLButtonElement>('#counter')!;
    expect(counterButton).toBeTruthy();
    expect(counterButton.tagName).toBe('BUTTON');
  });
});