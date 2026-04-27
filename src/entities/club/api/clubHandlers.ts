import { http, HttpResponse } from 'msw';
import {
  MOCK_CLUB_APPLICATIONS,
  MOCK_CLUBS,
  MOCK_CLUB_DETAILS,
  MOCK_CLUB_FORMS,
} from '../model/mock';
import type { CreateClubFormRequest } from '../model/club';

const MAJOR_CLUBS = MOCK_CLUBS.filter((c) => c.type === 'MAJOR_CLUB');
const AUTONOMOUS_CLUBS = MOCK_CLUBS.filter((c) => c.type === 'AUTONOMOUS_CLUB');

export const clubHandlers = [
  http.get('*/clubs', ({ request }) => {
    const type = new URL(request.url).searchParams.get('type');
    const clubs =
      type === 'AUTONOMOUS_CLUB' ? AUTONOMOUS_CLUBS : MAJOR_CLUBS;
    return HttpResponse.json({ data: { clubs } });
  }),

  http.get('*/clubs/:id/forms', ({ params }) => {
    const id = Number(params.id);
    const form = MOCK_CLUB_FORMS[id];

    if (!form) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '활성화된 폼 없음' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: form });
  }),

  http.get('*/clubs/:id/applications', ({ params }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];

    if (!detail || !MOCK_CLUB_FORMS[id]) {
      return HttpResponse.json(
        {
          status: 'NOT_FOUND',
          code: 404,
          message: '존재하지 않는 동아리 또는 생성된 폼 없음',
        },
        { status: 404 },
      );
    }

    if (detail.club.type !== 'MAJOR_CLUB') {
      return HttpResponse.json(
        {
          status: 'BAD_REQUEST',
          code: 400,
          message: '정규 동아리가 아님',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      data: MOCK_CLUB_APPLICATIONS[id] ?? { applications: [] },
    });
  }),

  http.post('*/clubs/:id/forms', async ({ params, request }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];

    if (!detail) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '동아리 없음' },
        { status: 404 },
      );
    }

    if (detail.club.type !== 'MAJOR_CLUB') {
      return HttpResponse.json(
        {
          status: 'BAD_REQUEST',
          code: 400,
          message: '자율 동아리는 폼을 만들 수 없습니다.',
        },
        { status: 400 },
      );
    }

    const body = (await request.json()) as CreateClubFormRequest;
    const formId = Math.max(0, ...Object.values(MOCK_CLUB_FORMS).map((form) => form.formId)) + 1;
    let nextFieldId = 1;
    let nextOptionId = 1;

    MOCK_CLUB_FORMS[id] = {
      formId,
      title: body.title,
      description: body.description,
      fields: body.fields.map((field) => ({
        fieldId: nextFieldId++,
        label: field.label,
        description: field.description,
        fieldType: field.fieldType,
        order: field.order,
        required: field.required,
        options: (field.options ?? []).map((option) => ({
          optionId: nextOptionId++,
          label: option.label,
          value: option.value,
        })),
      })),
    };

    return HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
      data: { formId },
    });
  }),

  http.post('*/clubs/:id/applications', () =>
    HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
      data: { applicationId: 1 },
    }),
  ),

  http.post('*/clubs/:id/autonomous/applications', () =>
    HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
    }),
  ),

  http.get('*/clubs/:id', ({ params }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: detail });
  }),
];
