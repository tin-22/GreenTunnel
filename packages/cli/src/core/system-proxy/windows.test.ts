import { describe, expect, it } from 'vitest';
import { DEFAULT_BYPASS } from './index.js';
import { appliedBypass } from './windows.js';

describe('appliedBypass', () => {
  it('leaves IPv6 literals out of the default list and adds <local>', () => {
    // A `[::1]` in the system bypass list reaches child processes as NO_PROXY,
    // and Python's httpx then throws `Invalid port: ':1]'` on startup.
    expect(appliedBypass(DEFAULT_BYPASS)).toEqual(['localhost', '127.0.0.1', '*.local', '<local>']);
  });

  it('drops IPv6 literals bare or bracketed and keeps everything else', () => {
    expect(
      appliedBypass(['::1', '[::1]', '[fe80::1]', 'fd00::5', '10.0.0.1', '*.corp', 'host.example']),
    ).toEqual(['10.0.0.1', '*.corp', 'host.example', '<local>']);
  });

  it('does not add <local> twice', () => {
    expect(appliedBypass(['<LOCAL>', 'a.example'])).toEqual(['<LOCAL>', 'a.example']);
  });
});
