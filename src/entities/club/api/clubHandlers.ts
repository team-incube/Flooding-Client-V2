import { http, HttpResponse } from 'msw';
import { MOCK_CLUBS, MOCK_CLUB_DETAILS } from '../model/mock';

const MAJOR_CLUBS = MOCK_CLUBS.filter((c) => c.type === 'MAJOR_CLUB');
const AUTONOMOUS_CLUBS = MOCK_CLUBS.filter((c) => c.type === 'AUTONOMOUS_CLUB');

export const clubHandlers = [
  http.get('*/clubs', ({ request }) => {
    const type = new URL(request.url).searchParams.get('type');
    const clubs =
      type === 'AUTONOMOUS_CLUB' ? AUTONOMOUS_CLUBS : MAJOR_CLUBS;
    return HttpResponse.json({ data: { clubs } });
  }),

  http.get('*/clubs/:id', ({ params }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: detail });
  }),
];
