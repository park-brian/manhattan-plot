/**
 * Returns the minimum value within an array of numbers
 * @param {number[]} values
 * @returns {number} The minimum value
 */
export function min(values) {
  let length = values.length;
  let min = values[0];
  for (let i = 1; i < length; i++) if (values[i] < min) min = values[i];
  return min;
}

/**
 * Returns the maximum value within an array of numbers
 * @param {number[]} values
 * @returns {number} The maximum value
 */
export function max(values) {
  let length = values.length;
  let max = values[0];
  for (let i = 1; i < length; i++) if (values[i] > max) max = values[i];
  return max;
}

/**
 * Returns the min and max value within an array of numbers
 * @param {number[]} values
 * @returns {[number, number]} The minimum and maximum value
 */
export function extent(values) {
  let length = values.length;
  let min = values[0];
  let max = values[0];

  for (let i = 1; i < length; i++) {
    let value = values[i];
    if (value > max) max = value;
    if (value < min) min = value;
  }

  return [min, max];
}

/**
 * Creates an array of numbers from the min to max
 * @param {number} min The minimum number in the range
 * @param {number} max The maximum number in the range (not inclusive)
 * @returns {number[]} Numbers from the min and max, excluding max
 */
export function createRange(min, max) {
  var size = Math.abs(max - min);
  var nums = new Array(size);
  for (let i = 0; i < size; i++) nums[i] = min + i;
  return nums;
}

/**
 * Returns evenly spaced numbers within a specified range
 * @param {number} min
 * @param {number} max
 * @param {number} numTicks
 * @returns {number[]} ticks within the specified range
 */
export function getTicks(min, max, numTicks = 10) {
  let ticks = new Array(numTicks);
  let interval = (max - min) / (numTicks - 1);
  for (let i = 0; i < numTicks; i++) ticks[i] = min + i * interval;
  return ticks;
}
