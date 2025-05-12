import clsx from 'clsx';
import type { ReactElement } from 'react';

interface TagProps {
  name: string;
  link?: string;
}

export function Tag({ name, link }: TagProps): ReactElement {
  return (
    <li className="tag_kw9c">
      <a
        className={clsx('tag_Nc8X', 'tagRegular_s1M5')}
        href={link ?? `/docs/tags/${encodeURIComponent(name)}`}
      >
        {name}
      </a>
    </li>
  );
}

export function TagList({ tags }: { tags: string[] }): ReactElement {
  return (
    <div className="row margin-top--sm theme-doc-footer-tags-row">
      <div className="col">
        <b>Tags:</b>
        <ul className="tags_vPCB padding--none margin-left--sm">
          {tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </ul>
      </div>
    </div>
  );
}
