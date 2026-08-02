'use client';

import { useSyncExternalStore } from 'react';

// Nothing to subscribe to: the answer only ever changes once, when hydration hands over.
const never = () => () => {};
const onServer = () => true;
const onClient = () => false;

/**
 * An inline script that belongs to the server's HTML and to nowhere else.
 *
 * The browser runs it while parsing, which is the whole point — that is what puts a
 * remembered choice in place before the first paint. Nothing re-runs it afterwards, so once
 * hydration is over the element has no job left, and React renders it away.
 *
 * The alternative, leaving it in the tree, is what makes React complain the moment anything
 * re-renders the layout on the client — changing the language does, since the root layout
 * lives inside the locale segment. `useSyncExternalStore` is how a component is told which
 * pass it is in: the server snapshot answers the server render and the hydration that has to
 * match it, the client snapshot every render after.
 *
 * The nonce is what the content security policy recognises the script by. Next marks the
 * scripts it writes itself; this one is the app's own, so it has to be handed the value.
 */
export function InlineScript({ html, nonce }: { html: string; nonce?: string }) {
  const rendersOnServer = useSyncExternalStore(never, onClient, onServer);

  if (!rendersOnServer) {
    return null;
  }

  return (
    <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
  );
}
