import { http, HttpResponse } from 'msw';
import { MOCK_STUDENTS } from '@/entities/user/model/mock';
import { 
  MOCK_MY_PENALTY, 
  MOCK_ALL_PENALTIES, 
  MOCK_CLEANING_ZONES, 
  MOCK_CLEANING_ZONE_DETAIL 
} from '../model/mock';

export const dormitoryHandlers = [
  // GET — 목록 조회
  http.get('*/dormitory/massage', () =>
    HttpResponse.json(MOCK_STUDENTS.slice(0, 5))
  ),
  http.get('*/dormitory/study', () => HttpResponse.json(MOCK_STUDENTS)),
  http.get('*/dormitory/penalties/me', () => HttpResponse.json(MOCK_MY_PENALTY)),
  http.get('*/dormitory/penalties', () => HttpResponse.json(MOCK_ALL_PENALTIES)),
  http.get('*/dormitory/cleaning-zones', () => HttpResponse.json(MOCK_CLEANING_ZONES)),
  http.get('*/dormitory/cleaning-zones/:zoneId', () => HttpResponse.json(MOCK_CLEANING_ZONE_DETAIL)),

  // POST — 신청
  // 구체적인 경로를 동적 경로보다 앞에 등록
  http.post('*/dormitory/massage', () =>
    HttpResponse.json({ success: true }, { status: 201 })
  ),
  http.post('*/dormitory/study', () =>
    HttpResponse.json({ success: true }, { status: 201 })
  ),
  http.post('*/dormitory/inquiry', () =>
    HttpResponse.json({ success: true }, { status: 201 })
  ),
  http.post('*/dormitory/cleaning-zones', () =>
    HttpResponse.json({ success: true }, { status: 201 })
  ),

  // DELETE — 취소/삭제 (구체적인 경로 먼저)
  http.delete('*/dormitory/massage', () => new HttpResponse(null, { status: 204 })),
  http.delete('*/dormitory/study', () => new HttpResponse(null, { status: 204 })),

  // PATCH — 자습 금지
  http.patch('*/dormitory/study/:userId', () =>
    new HttpResponse(null, { status: 204 })
  ),

  // PUT — 벌점 설정
  http.put('*/dormitory/penalties/:userId', () =>
    new HttpResponse(null, { status: 204 })
  ),
];
