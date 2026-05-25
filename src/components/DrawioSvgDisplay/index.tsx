/**
 * Module Text highlighting. Color designation is possible.
 * @module Highlight
 * @example
 * import { DrawioSvgDisplay } from '@site/src/components/DrawioSvgDisplay';
 * <DrawioSvgDisplay src='#25C2A0'>Green</Highlight>
 * <DrawioSvgDisplay src='#1877F2'>Blue</Highlight>
 */
import type { ReactElement } from 'react';

export interface DrawioSvgDisplayProps {
  /** `import foo from './xxx.drawio.svg?url'` の結果 */
  readonly src: unknown;
  /** アクセシビリティ用ラベル */
  readonly alt?: string;
  /** 幅。数値なら px 扱い */
  readonly width?: string | number;
  /** 高さ。数値なら px 扱い */
  readonly height?: string | number;
}

function unwrapModule(mod: unknown): string {
  let v: unknown = mod;
  while (typeof v === 'object' && v !== null && 'default' in v) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: dynamic traversal of nested `default`
    v = v.default;
  }
  if (typeof v !== 'string') {
    throw new Error('DrawioSvgDisplay: URL string not found in module');
  }
  return v;
}

export function DrawioSvgDisplay(props: DrawioSvgDisplayProps): ReactElement {
  const { src, alt = 'drawio svg', width = '100%', height = 'auto' } = props;

  const url = unwrapModule(src);

  return (
    <object
      type="image/svg+xml"
      data={url}
      width={width}
      height={height}
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* SVG が読み込めなかった場合のフォールバック */}
      <img src={url} alt={alt} width={width} height={height} />
    </object>
  );
}
