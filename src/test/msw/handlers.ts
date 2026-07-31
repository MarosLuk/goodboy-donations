import { http, HttpResponse } from 'msw';
import { env } from '@/lib/env';

export const shelterFixtures = [
  { id: 1, name: 'Žilinský útulok o.z.' },
  { id: 2, name: 'Trenčiansky Útulok' },
  { id: 3, name: 'HAFKÁČI' },
];

export const sheltersUrl = `${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/shelters/`;

export const resultsUrl = `${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/shelters/results`;

// What the shared assignment database actually holds, so the fixtures are not
// prettier than reality.
export const resultsFixture = { contributors: 6, contribution: 5 };

export const contributeUrl = `${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/shelters/contribute`;

export const handlers = [
  // The real database is shared between candidates, so a stray post would show up in
  // everyone's totals. Every test goes through this handler instead.
  http.post(contributeUrl, () =>
    HttpResponse.json({
      messages: [{ type: 'SUCCESS', message: 'Príspevok bol úspešne zaznamenaný' }],
    }),
  ),

  http.get(resultsUrl, () => HttpResponse.json(resultsFixture)),

  // Filtering happens on the real server, so the mock filters too — otherwise a
  // test could pass with a search term the component never actually sends.
  http.get(sheltersUrl, ({ request }) => {
    const search = new URL(request.url).searchParams.get('search') ?? '';

    return HttpResponse.json({
      shelters: shelterFixtures.filter((shelter) =>
        shelter.name.toLowerCase().includes(search.toLowerCase()),
      ),
    });
  }),
];
