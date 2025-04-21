/**
 * Module Text highlighting. Color designation is possible.
 * @module Highlight
 * @example
 * import TBD from '@site/src/components/Highlight';
 * <Highlight color='#25C2A0'>Green</Highlight>
 * <Highlight color='#1877F2'>Blue</Highlight>
 * <TBD/>
 */
import React from 'react';

/**
 * Highlight tag.
 * @param {{chidren: string, color: string}}
 * @returns {JSX.Element}
 */
function Highlight({children, color}) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '0.5rem',
        color: blackOrWhite(color),
        padding: '0.2rem',
      }}>
      {children}
    </span>
  )
}

/**
 * @see {@link https://www.w3.org/TR/AERT/#color-contract}
 * @param {string} - hex example. '11AAFF' or '1AF'
 * @return {string} '#FFF' or '#000'
 */
function blackOrWhite(hex) {
  const [r, g, b] = hex2rgb(hex);
  return ((((r * 299) + (g * 587) + (b * 114)) / 1000) < 120) ? '#FFF' : '#000';
}

/**
 * @param {string} - hexVal example. '11AAFF' or '1AF'
 * @return {number[]} [reg, green, blue]
 */
function hex2rgb(hexVal) {
  let hex = hexVal;
  if (/^#/.test(hex)) hex = hex.slice(1);
  if (![3, 6].includes(hex.length)) {
    throw new Error(`Invalid hex string. digit are 3 or 6. hex=${hex}`);
  }
  if (hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error(`Invalid hex string. not hex number. hex=${hex}`);
  }
  const rgb = hex.match(/../g);
  if (!rgb) {
    throw new Error(`Invalid hex string. unknown. hex=${hex}`);
  }

  return [parseInt(rgb[0], 16), parseInt(rgb[1], 16), parseInt(rgb[2], 16)];
}

export default Highlight
