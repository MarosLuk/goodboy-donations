// A script tag rendered by React only does anything on a hard load: the browser runs it while
// parsing the HTML, which is the whole point of it, but nothing re-executes it when React
// rebuilds the DOM on a client navigation. React warns about that in development.
//
// The type switch is what Next's own guide on preventing a flash before hydration
// recommends: executable in the server's HTML, inert once the client renders it, and
// suppressHydrationWarning so the differing attribute is not read as a mismatch.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
