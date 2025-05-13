/**
 * @jest-environment jsdom
 */

import { Moodal, MooDOM, Moostatic } from '../src/moodal';

describe('MooDOM', () => {
  let vdom: MooDOM;

  beforeEach(() => {
    document.body.innerHTML = '<div class="root"></div>';
    vdom = new MooDOM(document);
  });

  it('should insert and fetch an element correctly', () => {
    const el = document.createElement('div');
    el.className = 'test-div';

    vdom.insert(el);
    const fetched = vdom.fetch(el, { elementSelf: true });
    expect(fetched.self).toBe(el);
  });

  it('should throw error if removed element is not found', () => {
    const el = document.createElement('div');
    expect(() => vdom.remove(el)).toThrow("Element not found in the DOM");
  });
});
