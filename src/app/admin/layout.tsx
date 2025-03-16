import { Suspense, type ReactNode } from 'react';
import { Providers } from '../providers';

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Providers>
        <Suspense fallback={<div>Loading</div>}>
          {children}
        </Suspense>
      </Providers>
    </>
  )
}

