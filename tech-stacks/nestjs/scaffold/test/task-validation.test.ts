import { describe, it, expect } from 'vitest';
import { parseTaskId, parseTaskTitle } from '../src/task-validation';
describe('task validation', () => {
  it('normalizes a valid title', () => expect(parseTaskTitle(' Example ')).toBe('Example'));
  it('rejects an empty title', () => expect(() => parseTaskTitle(' ')).toThrow());
  it('rejects an invalid ID', () => expect(() => parseTaskId('0')).toThrow());
  it('accepts a positive ID', () => expect(parseTaskId('10')).toBe(10));
});
