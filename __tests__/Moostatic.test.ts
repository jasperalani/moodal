/**
 * @jest-environment jsdom
 */

import { Moodal, MooDOM, Moostatic } from '../src/moodal';

describe('Moostatic Utility Class', () => {
  describe('randomCharString', () => {
    it('should return a string with combined length of all inputs', () => {
      const result = Moostatic.randomCharString({ length: 5 }, { length: 3 }, { length: 2 });
      expect(typeof result).toBe('string');
      expect(result.length).toBe(10);
    });

    it('should return an empty string when no options are passed', () => {
      const result = Moostatic.randomCharString();
      expect(result).toBe('');
    });
  });

  describe('newElement', () => {
    it('should create a div with random class and innerHTML', () => {
      const el = Moostatic.newElement();
      expect(el.tagName.toLowerCase()).toBe('div');
      expect(el.classList.contains('auto-generated')).toBe(true);
      expect(el.innerHTML.length).toBeGreaterThan(0);
    });

    it('should insert the element into the DOM when flag is true', () => {
      const el = Moostatic.newElement(true);
      expect(document.body.contains(el)).toBe(true);
    });
  });

  describe('benchmark', () => {
    it('should run the function 1000 times without errors', () => {
      const mockFn = jest.fn();
      Moostatic.benchmark('Mock Benchmark', mockFn, 10); // reduce to 10 for test speed
      expect(mockFn).toHaveBeenCalledTimes(10);
    });
  });

  describe('domToJson', () => {
    it('should convert a DOM node to a JSON representation', () => {
      const div = document.createElement('div');
      div.className = 'test-class';
      div.innerHTML = '<p>Hello</p>';
      const json = Moostatic.domToJson(div);

      expect(json.tag).toBe('div');
      expect(json.className).toBe('test-class');
      expect(Array.isArray(json.children)).toBe(true);
      expect(json.children[0].tag).toBe('p');
    });

    it('should handle text nodes correctly', () => {
      const textNode = document.createTextNode('Some text');
      const json = Moostatic.domToJson(textNode);
      expect(json.text).toBe('Some text');
      expect(json.nodeType).toBe(Node.TEXT_NODE);
    });

    it('should handle comment nodes correctly', () => {
      const comment = document.createComment('This is a comment');
      const json = Moostatic.domToJson(comment);
      expect(json.comment).toBe('This is a comment');
      expect(json.nodeType).toBe(Node.COMMENT_NODE);
    });
  });
});
