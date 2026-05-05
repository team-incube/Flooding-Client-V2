import { http, HttpResponse } from 'msw';
import {
  MOCK_CLUB_APPLICATIONS,
  MOCK_CLUBS,
  MOCK_CLUB_DETAILS,
  MOCK_CLUB_FORMS,
} from '../model/mock';
import { MOCK_STUDENTS } from '@/entities/user/model/mock';
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

  http.put('*/clubs/:id/forms', async ({ params, request }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];
    const form = MOCK_CLUB_FORMS[id];

    if (!detail || !form) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '동아리 또는 폼 없음' },
        { status: 404 },
      );
    }

    if ((MOCK_CLUB_APPLICATIONS[id]?.applications.length ?? 0) > 0) {
      return HttpResponse.json(
        {
          status: 'CONFLICT',
          code: 409,
          message: '신청자가 있어 수정 불가',
        },
        { status: 409 },
      );
    }

    const body = (await request.json()) as CreateClubFormRequest;
    let nextFieldId = 1;
    let nextOptionId = 1;

    MOCK_CLUB_FORMS[id] = {
      formId: form.formId,
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

  http.patch('*/clubs/:id/applications/:userId', ({ params }) => {
    const id = Number(params.id);
    const userId = Number(params.userId);
    const applicationList = MOCK_CLUB_APPLICATIONS[id];

    if (applicationList) {
      applicationList.applications = applicationList.applications.filter(
        (application) => application.applicant.id !== userId,
      );
    }

    return HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
    });
  }),

  http.post('*/clubs/:id/autonomous/applications', () =>
    HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
    }),
  ),

  http.post('*/clubs/:clubId/member/:userId', ({ params }) => {
    const clubId = Number(params.clubId);
    const userId = Number(params.userId);
    const detail = MOCK_CLUB_DETAILS[clubId];

    if (!detail) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '동아리 없음' },
        { status: 404 },
      );
    }

    const alreadyMember = detail.members.some((m) => m.id === userId);
    if (alreadyMember) {
      return HttpResponse.json(
        { status: 'CONFLICT', code: 409, message: '이미 멤버입니다.' },
        { status: 409 },
      );
    }

    const student = MOCK_STUDENTS.find((s) => s.id === userId);
    if (!student) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '유저를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    detail.members.push({
      id: student.id,
      name: student.name,
      studentNumber: student.studentNumber,
      sex: student.sex,
      specialty: student.specialty,
    });

    return HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
    });
  }),

  http.delete('*/clubs/:clubId/member/exile/:userId', ({ params }) => {
    const clubId = Number(params.clubId);
    const userId = Number(params.userId);
    const detail = MOCK_CLUB_DETAILS[clubId];

    if (!detail) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '동아리 없음' },
        { status: 404 },
      );
    }

    detail.members = detail.members.filter((m) => m.id !== userId);

    return HttpResponse.json({
      status: 'OK',
      code: 200,
      message: 'OK',
    });
  }),

  http.patch('*/clubs/:id/transfer/:targetUserId', ({ params }) => {
    const id = Number(params.id);
    const targetUserId = Number(params.targetUserId);
    const detail = MOCK_CLUB_DETAILS[id];

    if (!detail) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '동아리 없음' },
        { status: 404 },
      );
    }

    const targetMember = detail.members.find((m) => m.id === targetUserId);
    if (!targetMember) {
      return HttpResponse.json(
        { status: 'NOT_FOUND', code: 404, message: '멤버를 찾을 수 없음' },
        { status: 404 },
      );
    }

    const clubInList = MOCK_CLUBS.find((c) => c.id === id);
    if (clubInList) {
      clubInList.leader = targetMember.name;
    }
    detail.club.leader = targetMember.name;

    return HttpResponse.json({
      status: 'OK',
      code: 200,
      message: '완료되었습니다.',
    });
  }),

  http.get('*/clubs/opening/requests', () => {
    return HttpResponse.json({ data: { clubs: [] } });
  }),

  http.get('*/clubs/opening-status', () => {
    return HttpResponse.json({ data: { isOpened: true, startDate: null, endDate: null } });
  }),

  http.get('*/clubs/:id', ({ params }) => {
    const id = Number(params.id);
    const detail = MOCK_CLUB_DETAILS[id];
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: detail });
  }),

  http.post('*/clubs', () => {
    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  http.put('*/clubs/:clubId', async () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.patch('*/clubs/:clubId/approval', async ({ params, request }) => {
    const { clubId } = params;
    const body = (await request.json()) as { approved: boolean };
    return HttpResponse.json(
      {
        clubId: Number(clubId),
        status: body.approved ? 'APPROVED' : 'REJECTED',
      },
      { status: 200 }
    );
  }),

  http.delete('*/clubs/:clubId', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
