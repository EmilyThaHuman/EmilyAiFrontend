import chroma from 'chroma-js';

// function hexToRgb(color) {
//   return chroma(color).rgb().join(', ');
// }
function hexToRgb(color) {
  try {
    return chroma(color).rgb();
  } catch (error) {
    console.warn('Invalid color format:', color);
    return chroma('#000000').rgb(); // Fallback to black
  }
}
export default hexToRgb;
