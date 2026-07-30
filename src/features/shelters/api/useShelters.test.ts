import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/errors';
import { sheltersUrl } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createQueryWrapper } from '@/test/query';
import { useShelters } from './useShelters';

function renderShelters(search: string) {
  return renderHook(() => useShelters(search), { wrapper: createQueryWrapper() });
}

describe('useShelters', () => {
  it('returns every shelter when nothing is searched for', async () => {
    const { result } = renderShelters('');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.map((shelter) => shelter.name)).toEqual([
      'Žilinský útulok o.z.',
      'Trenčiansky Útulok',
      'HAFKÁČI',
    ]);
  });

  it('hands the search term to the api instead of filtering locally', async () => {
    const searches: (string | null)[] = [];

    server.use(
      http.get(sheltersUrl, ({ request }) => {
        searches.push(new URL(request.url).searchParams.get('search'));

        return HttpResponse.json({ shelters: [{ id: 3, name: 'HAFKÁČI' }] });
      }),
    );

    const { result } = renderShelters('hafk');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searches).toEqual(['hafk']);
    expect(result.current.data).toEqual([{ id: 3, name: 'HAFKÁČI' }]);
  });

  it('leaves an empty search out of the query string', async () => {
    const urls: string[] = [];

    server.use(
      http.get(sheltersUrl, ({ request }) => {
        urls.push(request.url);

        return HttpResponse.json({ shelters: [] });
      }),
    );

    const { result } = renderShelters('');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(urls[0]).not.toContain('search=');
  });

  it('fails when the response does not match the schema', async () => {
    server.use(
      http.get(sheltersUrl, () => HttpResponse.json({ shelters: [{ id: '3', name: 'HAFKÁČI' }] })),
    );

    const { result } = renderShelters('');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('surfaces an api error with its status and messages', async () => {
    server.use(
      http.get(sheltersUrl, () =>
        HttpResponse.json(
          { messages: [{ type: 'ERROR', message: 'joi.query.search', path: 'query.search' }] },
          { status: 400 },
        ),
      ),
    );

    const { result } = renderShelters('');

    await waitFor(() => expect(result.current.isError).toBe(true));

    const error = result.current.error;
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).messages[0]?.path).toBe('query.search');
  });

  it('reports a status even when an error body is not json', async () => {
    server.use(http.get(sheltersUrl, () => new HttpResponse('<html>nope</html>', { status: 500 })));

    const { result } = renderShelters('');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as ApiError).status).toBe(500);
    expect((result.current.error as ApiError).messages).toEqual([]);
  });
});
