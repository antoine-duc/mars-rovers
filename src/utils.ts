export const directions = ['N', 'E', 'S', 'W'];

export const movesByDirection = {
    N: [0, 1],
    E: [1, 0],
    S: [0, -1],
    W: [-1, 0]
};
export const checkPosAndDirection = (x: number, y: number, direction: string, dimensions: [number, number]) : boolean => {
    return !isNaN(x) && x >= 0 && x <= dimensions[0] && !isNaN(y) && y >= 0 && y <= dimensions[1] && directions.includes(direction);
};
  
export const checkSequence = (sequence: string) : boolean => {
    return !sequence.replace(/M|L|R/g, '').trim().length;
};