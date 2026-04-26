import { http, HttpResponse } from 'msw';
import { MOCK_CLUBS, MOCK_CLUB_DETAILS } from '../model/mock';

export const clubHandlers = [
  http.get('/club', () =>
    HttpResponse.json({ club: MOCK_CLUBS })
  ),

  http.get('/club/:id', ({ params }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];

    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(detail);
  }),
];
