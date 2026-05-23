import { describe, expect, it } from 'vitest';

import {
  coerceTngFileUploadMaxSize,
  getTngFileUploadExtension,
  matchesTngFileUploadAccept,
  normalizeTngFileUploadAccept,
  normalizeTngFileUploadFiles,
  validateTngFileUploadFiles,
} from '../tng-file-upload.utils';
import { makeFile } from './tng-file-upload.test-helpers';

describe('normalizeTngFileUploadAccept', () => {
  it('treats undefined as no restriction', () => {
    expect(normalizeTngFileUploadAccept(undefined)).toEqual([]);
  });

  it('treats null as no restriction', () => {
    expect(normalizeTngFileUploadAccept(null)).toEqual([]);
  });

  it('treats an empty string as no restriction', () => {
    expect(normalizeTngFileUploadAccept('')).toEqual([]);
  });

  it('treats a whitespace-only string as no restriction', () => {
    expect(normalizeTngFileUploadAccept('   ')).toEqual([]);
  });

  it('splits comma-separated values', () => {
    expect(normalizeTngFileUploadAccept('.png,.jpg')).toEqual(['.png', '.jpg']);
  });

  it('ignores whitespace around comma-separated values', () => {
    expect(normalizeTngFileUploadAccept(' .png , .jpg ')).toEqual(['.png', '.jpg']);
  });

  it('lower-cases tokens', () => {
    expect(normalizeTngFileUploadAccept('.PNG,IMAGE/PNG')).toEqual(['.png', 'image/png']);
  });

  it('deduplicates tokens', () => {
    expect(normalizeTngFileUploadAccept('.png,.png')).toEqual(['.png']);
  });

  it('supports an array of tokens', () => {
    expect(normalizeTngFileUploadAccept(['.png', '.jpg'])).toEqual(['.png', '.jpg']);
  });

  it('supports an array of comma-separated tokens', () => {
    expect(normalizeTngFileUploadAccept(['.png,.jpg', 'application/pdf'])).toEqual([
      '.png',
      '.jpg',
      'application/pdf',
    ]);
  });
});

describe('coerceTngFileUploadMaxSize', () => {
  it('returns null for null', () => {
    expect(coerceTngFileUploadMaxSize(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(coerceTngFileUploadMaxSize(undefined)).toBeNull();
  });

  it('returns null for zero', () => {
    expect(coerceTngFileUploadMaxSize(0)).toBeNull();
  });

  it('returns null for negative values', () => {
    expect(coerceTngFileUploadMaxSize(-10)).toBeNull();
  });

  it('returns null for non-finite values', () => {
    expect(coerceTngFileUploadMaxSize(Number.NaN)).toBeNull();
  });

  it('returns the numeric value for positive numbers', () => {
    expect(coerceTngFileUploadMaxSize(1024)).toBe(1024);
  });

  it('coerces numeric strings', () => {
    expect(coerceTngFileUploadMaxSize('2048')).toBe(2048);
  });
});

describe('getTngFileUploadExtension', () => {
  it('returns the lower-cased extension', () => {
    expect(getTngFileUploadExtension('photo.PNG')).toBe('.png');
  });

  it('returns an empty string when there is no extension', () => {
    expect(getTngFileUploadExtension('noextension')).toBe('');
  });

  it('returns only the final extension for names with multiple dots', () => {
    expect(getTngFileUploadExtension('archive.tar.gz')).toBe('.gz');
  });

  it('treats dot-prefixed names without an extension as having none', () => {
    expect(getTngFileUploadExtension('.gitignore')).toBe('');
  });
});

describe('matchesTngFileUploadAccept', () => {
  it('accepts any file when accept is empty', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.txt', 'text/plain'), [])).toBe(true);
  });

  it('accepts a file matching a single extension', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.pdf', 'application/pdf'), ['.pdf'])).toBe(true);
  });

  it('rejects a file not matching a single extension', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.txt', 'text/plain'), ['.pdf'])).toBe(false);
  });

  it('accepts a file matching one of many extensions', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.jpg', 'image/jpeg'), ['.png', '.jpg'])).toBe(true);
  });

  it('matches extensions case-insensitively', () => {
    expect(matchesTngFileUploadAccept(makeFile('A.JPG', 'image/jpeg'), ['.jpg'])).toBe(true);
  });

  it('matches files with empty MIME type by extension', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.pdf', ''), ['.pdf'])).toBe(true);
  });

  it('accepts a file matching an exact MIME type', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.pdf', 'application/pdf'), ['application/pdf'])).toBe(
      true,
    );
  });

  it('rejects a file not matching an exact MIME type', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.png', 'image/png'), ['application/pdf'])).toBe(
      false,
    );
  });

  it('accepts image/png when accept is image/*', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.png', 'image/png'), ['image/*'])).toBe(true);
  });

  it('accepts image/jpeg when accept is image/*', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.jpg', 'image/jpeg'), ['image/*'])).toBe(true);
  });

  it('rejects application/pdf when accept is image/*', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.pdf', 'application/pdf'), ['image/*'])).toBe(false);
  });

  it('accepts video/mp4 when accept is video/*', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.mp4', 'video/mp4'), ['video/*'])).toBe(true);
  });

  it('rejects empty MIME type for wildcard accept unless extension also matches', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.png', ''), ['image/*'])).toBe(false);
    expect(matchesTngFileUploadAccept(makeFile('a.png', ''), ['image/*', '.png'])).toBe(true);
  });

  it('accepts by extension when accept mixes extension and MIME values', () => {
    expect(
      matchesTngFileUploadAccept(makeFile('a.png', ''), ['.png', 'application/pdf']),
    ).toBe(true);
  });

  it('accepts by exact MIME when accept mixes extension and MIME values', () => {
    expect(
      matchesTngFileUploadAccept(makeFile('a.bin', 'application/pdf'), ['.png', 'application/pdf']),
    ).toBe(true);
  });

  it('accepts by wildcard MIME when accept mixes extension and wildcard values', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.bin', 'image/gif'), ['.png', 'image/*'])).toBe(
      true,
    );
  });

  it('rejects when no rule matches', () => {
    expect(matchesTngFileUploadAccept(makeFile('a.txt', 'text/plain'), ['.png', 'image/*'])).toBe(
      false,
    );
  });
});

describe('normalizeTngFileUploadFiles', () => {
  it('returns an empty array for null', () => {
    expect(normalizeTngFileUploadFiles(null)).toEqual([]);
  });

  it('returns an empty array for undefined', () => {
    expect(normalizeTngFileUploadFiles(undefined)).toEqual([]);
  });

  it('keeps only File instances', () => {
    const file = makeFile('a.png', 'image/png');
    expect(normalizeTngFileUploadFiles([file, { nope: true }])).toEqual([file]);
  });
});

describe('validateTngFileUploadFiles', () => {
  const options = { accept: [] as readonly string[], maxSize: null, multiple: true };

  it('accepts a file smaller than maxSize', () => {
    const file = makeFile('a.txt', 'text/plain', 10);
    const result = validateTngFileUploadFiles([file], { ...options, maxSize: 20 });
    expect(result.accepted).toEqual([file]);
  });

  it('accepts a file exactly equal to maxSize', () => {
    const file = makeFile('a.txt', 'text/plain', 20);
    const result = validateTngFileUploadFiles([file], { ...options, maxSize: 20 });
    expect(result.accepted).toEqual([file]);
  });

  it('rejects a file larger than maxSize with reason size', () => {
    const file = makeFile('a.txt', 'text/plain', 30);
    const result = validateTngFileUploadFiles([file], { ...options, maxSize: 20 });
    expect(result.accepted).toEqual([]);
    expect(result.rejected[0].reason).toBe('size');
    expect(result.rejected[0].message.length).toBeGreaterThan(0);
  });

  it('rejects a type mismatch with reason type', () => {
    const file = makeFile('a.txt', 'text/plain');
    const result = validateTngFileUploadFiles([file], { ...options, accept: ['.pdf'] });
    expect(result.rejected[0].reason).toBe('type');
  });

  it('accepts only the first file and rejects the rest with multiple when multiple is false', () => {
    const first = makeFile('a.png', 'image/png');
    const second = makeFile('b.png', 'image/png');
    const result = validateTngFileUploadFiles([first, second], { ...options, multiple: false });
    expect(result.accepted).toEqual([first]);
    expect(result.rejected[0].file).toBe(second);
    expect(result.rejected[0].reason).toBe('multiple');
  });

  it('accepts all valid files when multiple is true', () => {
    const first = makeFile('a.png', 'image/png');
    const second = makeFile('b.png', 'image/png');
    const result = validateTngFileUploadFiles([first, second], options);
    expect(result.accepted).toEqual([first, second]);
  });

  it('preserves accepted and rejected order across mixed results', () => {
    const good1 = makeFile('a.png', 'image/png', 5);
    const bad = makeFile('b.txt', 'text/plain', 5);
    const good2 = makeFile('c.png', 'image/png', 5);
    const big = makeFile('d.png', 'image/png', 999);
    const result = validateTngFileUploadFiles([good1, bad, good2, big], {
      accept: ['image/*'],
      maxSize: 100,
      multiple: true,
    });
    expect(result.accepted).toEqual([good1, good2]);
    expect(result.rejected.map((entry) => entry.reason)).toEqual(['type', 'size']);
  });

  it('prefers the type reason when a file fails both type and size', () => {
    const file = makeFile('a.txt', 'text/plain', 999);
    const result = validateTngFileUploadFiles([file], {
      accept: ['.pdf'],
      maxSize: 10,
      multiple: true,
    });
    expect(result.rejected[0].reason).toBe('type');
  });

  it('still accepts valid files when another file is oversized', () => {
    const ok = makeFile('a.png', 'image/png', 5);
    const big = makeFile('b.png', 'image/png', 999);
    const result = validateTngFileUploadFiles([ok, big], {
      accept: [],
      maxSize: 100,
      multiple: true,
    });
    expect(result.accepted).toEqual([ok]);
    expect(result.rejected[0].file).toBe(big);
  });

  it('returns no rejections when all files are accepted', () => {
    const file = makeFile('a.png', 'image/png');
    const result = validateTngFileUploadFiles([file], options);
    expect(result.rejected).toEqual([]);
  });
});
