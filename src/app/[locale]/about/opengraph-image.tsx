// Same reason as the contact segment: a child openGraph object replaces the parent one
// rather than merging into it, so without this the page would ship no image at all.
export { alt, contentType, default, size } from '../opengraph-image';
