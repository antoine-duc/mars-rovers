import { checkSequence, checkPosAndDirection } from './utils';

test('check sequence', () => {
    expect(checkSequence('LRMLRM')).toBe(true);
    expect(checkSequence('LRM RM ')).toBe(true);
    expect(checkSequence('LRMlrm')).toBe(false);
    expect(checkSequence('LRMLA')).toBe(false);
});

test('check pos and direction', () => {
    expect(checkPosAndDirection(-1, 0, 'E', [5, 5])).toBe(false);
    expect(checkPosAndDirection(5, -1, 'E', [5, 5])).toBe(false);
    expect(checkPosAndDirection(5, 5, 'Z', [5, 5])).toBe(false);
    expect(checkPosAndDirection(5, 5, 'E', [4, 5])).toBe(false);
    expect(checkPosAndDirection(5, 5, 'E', [5, 4])).toBe(false);
    expect(checkPosAndDirection(2, 2, 'E', [5, 5])).toBe(true);
});

export {};