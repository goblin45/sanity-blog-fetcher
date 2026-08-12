import { sanitizeInput, sanitizeString } from '@/lib/api/sanitize';

describe('sanitizeString', () => {
  it('trims whitespace and strips control characters', () => {
    expect(sanitizeString('  hello\u0000world  ')).toBe('helloworld');
  });

  it('removes script tags', () => {
    expect(sanitizeString('<script>alert(1)</script>safe')).toBe('alert(1)safe');
  });
});

describe('sanitizeInput', () => {
  it('sanitizes nested objects and arrays for POST/PUT payloads', () => {
    const input = {
      name: '  Ada  ',
      tags: ['  one ', '<script>x</script>two'],
      nested: { note: ' ok\u0007 ' },
    };

    expect(sanitizeInput(input)).toEqual({
      name: 'Ada',
      tags: ['one', 'xtwo'],
      nested: { note: 'ok' },
    });
  });
});
