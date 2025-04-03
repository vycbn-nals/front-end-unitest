import { describe, it, expect } from 'vitest';
import { setupCounter } from '../counter';
import { JSDOM } from 'jsdom';

// Set up a simulated DOM environment
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
global.window = window as unknown as Window & typeof globalThis;


describe('setupCounter', () => {
  it('should initialize the counter to 0 and update on click', () => {
    const button = document.createElement('button');
    setupCounter(button);

    expect(button.innerHTML).toBe('count is 0');
    button.click();
    expect(button.innerHTML).toBe('count is 1');
    button.click();
    expect(button.innerHTML).toBe('count is 2');
  });

  it('should work with a different button element', () => {
    const button = document.createElement('button');
    setupCounter(button);

    expect(button.innerHTML).toBe('count is 0');
    button.click();
    expect(button.innerHTML).toBe('count is 1');
  });

  it('should allow setting a different initial value', () => {
    const button = document.createElement('button');
    let counter = 5;
    const setCounter = (count: number) => {
      counter = count;
      button.innerHTML = `count is ${counter}`;
    };
    button.addEventListener('click', () => setCounter(counter + 1));
    setCounter(5);

    expect(button.innerHTML).toBe('count is 5');
    button.click();
    expect(button.innerHTML).toBe('count is 6');
  });

  it('should work with a different event', () => {
    const button = document.createElement('button');
    let counter = 0;
    const setCounter = (count: number) => {
      counter = count;
      button.innerHTML = `count is ${counter}`;
    };
    button.addEventListener('mouseover', () => setCounter(counter + 1));
    setCounter(0);

    expect(button.innerHTML).toBe('count is 0');
    button.dispatchEvent(new window.MouseEvent('mouseover'));
    expect(button.innerHTML).toBe('count is 1');
  });

  it('should work with a different event handler', () => {
    const button = document.createElement('button');
    let counter = 0;
    const customHandler = () => {
      counter += 2;
      button.innerHTML = `count is ${counter}`;
    };
    button.addEventListener('click', customHandler);
    customHandler();

    expect(button.innerHTML).toBe('count is 2');
    button.click();
    expect(button.innerHTML).toBe('count is 4');
  });

  it('should work with a different event handler and arguments', () => {
    const button = document.createElement('button');
    let counter = 0;
    const customHandler = (increment: number) => {
      counter += increment;
      button.innerHTML = `count is ${counter}`;
    };
    button.addEventListener('click', () => customHandler(3));
    customHandler(0);

    expect(button.innerHTML).toBe('count is 0');
    button.click();
    expect(button.innerHTML).toBe('count is 3');
    button.click();
    expect(button.innerHTML).toBe('count is 6');
  });

  it('should handle null or undefined element gracefully', () => {
    const element = null;
    setupCounter(element as unknown as HTMLButtonElement);
    expect(() => setupCounter(element as unknown as HTMLButtonElement)).not.toThrow();
  });
});