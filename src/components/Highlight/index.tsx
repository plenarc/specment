/**
 * Module Text highlighting. Color designation is possible.
 * @module Highlight
 * @example
 * import { Highlight } from '@site/src/components/Highlight';
 * <Highlight color='#25C2A0'>Green</Highlight>
 * <Highlight color='#1877F2'>Blue</Highlight>
 */
import type { ReactElement, ReactNode } from 'react';

type HighlightProps = {
  /** 強調したい文字列（子要素） */
  children: ReactNode;
  /** 背景色（16進数表記 #RRGGBB か #RGB） */
  color: string;
};

/**
 * Highlight tag.
 * @param {{chidren: string, color: string}}
 * @returns {JSX.Element}
 */
export function Highlight({ children, color }: HighlightProps): ReactElement {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '0.5rem',
        color: blackOrWhite(color),
        padding: '0.2rem',
      }}
    >
      {children}
    </span>
  );
}

/**
 * @see {@link https://www.w3.org/TR/AERT/#color-contract}
 * @param  hex - example. '11AAFF' or '1AF'
 */
function blackOrWhite(hex: string): '#FFF' | '#000' {
  const [r, g, b] = hex2rgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 < 120 ? '#FFF' : '#000';
}

/**
 * @param hexVal - example. '11AAFF' or '1AF'
 */
function hex2rgb(hexVal: string): [number, number, number] {
  let hex = hexVal.startsWith('#') ? hexVal.slice(1) : hexVal;

  if (![3, 6].includes(hex.length)) {
    throw new Error(`Invalid hex string: digit must be 3 or 6. hex=${hexVal}`);
  }

  if (hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error(`Invalid hex string. not hex number. hex=${hex}`);
  }
  const rgb = hex.match(/../g);
  if (!rgb) {
    throw new Error(`Invalid hex string. unknown. hex=${hex}`);
  }

  return [Number.parseInt(rgb[0], 16), Number.parseInt(rgb[1], 16), Number.parseInt(rgb[2], 16)];
}
