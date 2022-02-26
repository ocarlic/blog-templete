import { useEffect, useRef } from 'react';

export default function Comments(): JSX.Element {
  const comment = useRef<HTMLDivElement>();

  useEffect(() => {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://utteranc.es/client.js');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute('async', 'true');
    scriptEl.setAttribute('repo', 'ocarlic/blog-templete');
    scriptEl.setAttribute('issue-term', 'pathname');
    scriptEl.setAttribute('theme', 'photon-dark');
    comment.current.appendChild(scriptEl);
  }, []);

  return <div ref={comment} />;
}
