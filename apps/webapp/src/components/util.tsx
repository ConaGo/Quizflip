import React, { useEffect, useState } from 'react';
//This wrapper is used to wrap dynamic content that should not rendered on the server
//It can f.e. prevent a flash of unauthenticated content
//more information can be found on this blog post
//https://www.joshwcomeau.com/react/the-perils-of-rehydration/

type ClientOnlyProps = {
  children: React.ReactChildren;
  [x: string]: unknown;
};
export default function ClientOnly({
  children,
  ...delegated
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}
