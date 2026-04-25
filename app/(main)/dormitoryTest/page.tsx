'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { dormitoryQueries, dormitoryMutations } from '@/entities/dormitory/api/dormitoryQueries';

export default function Page() {
  const queryClient = useQueryClient();

  // ─── GET 상태 ───
  const myPenalty = useQuery(dormitoryQueries.myPenalties());
  const allPenalties = useQuery(dormitoryQueries.allPenalties());
  const cleaningZones = useQuery(dormitoryQueries.cleaningZones());
  const cleaningZoneDetails = useQuery(dormitoryQueries.cleaningZoneDetail(0));

  // ─── PUT: 유저 벌점 설정 ───
  const [userId, setUserId] = useState('');
  const [penaltyScore, setPenaltyScore] = useState(0);
  const [penaltyReason, setPenaltyReason] = useState('');

  const updatePenalty = useMutation({
    mutationFn: () =>
      dormitoryMutations.updatePenalties(Number(userId), {
        score: penaltyScore,
        reason: penaltyReason,
      }),
    onSuccess: (data) => {
      alert('벌점 설정 성공');
      console.log('벌점 설정 응답:', data);
      queryClient.invalidateQueries({ queryKey: ['dormitory', 'penalties'] });
    },
    onError: (error) => {
      alert('벌점 설정 실패');
      console.error('벌점 설정 에러:', error);
    },
  });

  // ─── PATCH: 청소 구역 인원 배정 ───
  const [patchZoneId, setPatchZoneId] = useState('');
  const [userIds, setUserIds] = useState('');

  const assignMembers = useMutation({
    mutationFn: () =>
      dormitoryMutations.assignCleaningZoneMembers(Number(patchZoneId), {
        userIds: userIds.split(',').map((id) => id.trim()).filter(Boolean).map(Number).filter((id) => !isNaN(id)),
      }),
    onSuccess: (data) => {
      alert('인원 배정 성공');
      console.log('인원 배정 응답:', data);
      queryClient.invalidateQueries({ queryKey: ['dormitory', 'cleaning-zones'] });
    },
    onError: (error) => {
      alert('인원 배정 실패');
      console.error('인원 배정 에러:', error);
    },
  });

  // ─── POST: 청소 구역 생성 ───
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');

  const createZone = useMutation({
    mutationFn: () =>
      dormitoryMutations.createCleaningZone({
        name: zoneName,
        description: zoneDescription,
      }),
    onSuccess: (data) => {
      alert('청소 구역 생성 성공');
      console.log('청소 구역 생성 응답:', data);
      queryClient.invalidateQueries({ queryKey: ['dormitory', 'cleaning-zones'] });
    },
    onError: (error) => {
      alert('청소 구역 생성 실패');
      console.error('청소 구역 생성 에러:', error);
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 max-w-3xl mx-auto font-mono">

      {/* ── GET: 내 벌점 조회 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          GET /dormitory/penalties/me{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            내 벌점 조회
          </span>
        </h2>
        {myPenalty.isLoading && <p className="text-gray-500">로딩중...</p>}
        {myPenalty.isError && (
          <p className="text-red-500">에러: {String(myPenalty.error)}</p>
        )}
        {myPenalty.data && (
          <pre className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(myPenalty.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── GET: 전체 벌점 조회 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          GET /dormitory/penalties{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            전체 벌점 조회
          </span>
        </h2>
        {allPenalties.isLoading && <p className="text-gray-500">로딩중...</p>}
        {allPenalties.isError && (
          <p className="text-red-500">에러: {String(allPenalties.error)}</p>
        )}
        {allPenalties.data && (
          <pre className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(allPenalties.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── GET: 청소 구역 목록 조회 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          GET /dormitory/cleaning-zones{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            청소 구역 목록
          </span>
        </h2>
        {cleaningZones.isLoading && <p className="text-gray-500">로딩중...</p>}
        {cleaningZones.isError && (
          <p className="text-red-500">에러: {String(cleaningZones.error)}</p>
        )}
        {cleaningZones.data && (
          <pre className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(cleaningZones.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── GET: 청소 구역 상세 조회 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          GET /dormitory/cleaning-zones/:zoneId{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            청소 구역 상세
          </span>
        </h2>
        {cleaningZoneDetails.isLoading && <p className="text-gray-500">로딩중...</p>}
        {cleaningZoneDetails.isError && (
          <p className="text-red-500">에러: {String(cleaningZoneDetails.error)}</p>
        )}
        {cleaningZoneDetails.data && (
          <pre className="bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(cleaningZoneDetails.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── PUT: 유저 벌점 설정 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          PUT /dormitory/penalties/:userId{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
            유저 벌점 설정
          </span>
        </h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-sm font-medium">userId</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="userId 입력"
          />
          <label className="text-sm font-medium">score</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            type="number"
            value={penaltyScore}
            onChange={(e) => setPenaltyScore(Number(e.target.value))}
            placeholder="점수 입력"
          />
          <label className="text-sm font-medium">reason</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={penaltyReason}
            onChange={(e) => setPenaltyReason(e.target.value)}
            placeholder="사유 입력"
          />
          <button
            className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-md cursor-pointer transition-colors"
            onClick={() => updatePenalty.mutate()}
            disabled={updatePenalty.isPending}
          >
            {updatePenalty.isPending ? '전송 중...' : '벌점 설정 요청'}
          </button>
        </div>
        {updatePenalty.data && (
          <pre className="mt-3 bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(updatePenalty.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── PATCH: 청소 구역 인원 배정 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          PATCH /dormitory/cleaning-zones/:zoneId/members{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
            청소 구역 인원 배정
          </span>
        </h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-sm font-medium">zoneId</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={patchZoneId}
            onChange={(e) => setPatchZoneId(e.target.value)}
            placeholder="zoneId 입력"
          />
          <label className="text-sm font-medium">userIds (쉼표로 구분)</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            placeholder="예: 1, 2, 3"
          />
          <button
            className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold rounded-md cursor-pointer transition-colors"
            onClick={() => assignMembers.mutate()}
            disabled={assignMembers.isPending}
          >
            {assignMembers.isPending ? '전송 중...' : '인원 배정 요청'}
          </button>
        </div>
        {assignMembers.data && (
          <pre className="mt-3 bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(assignMembers.data, null, 2)}
          </pre>
        )}
      </section>

      {/* ── POST: 청소 구역 생성 ── */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          POST /dormitory/cleaning-zones{' '}
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
            청소 구역 생성
          </span>
        </h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-sm font-medium">name</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="구역 이름 입력"
          />
          <label className="text-sm font-medium">description</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={zoneDescription}
            onChange={(e) => setZoneDescription(e.target.value)}
            placeholder="구역 설명 입력"
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-md cursor-pointer transition-colors"
            onClick={() => createZone.mutate()}
            disabled={createZone.isPending}
          >
            {createZone.isPending ? '전송 중...' : '청소 구역 생성 요청'}
          </button>
        </div>
        {createZone.data && (
          <pre className="mt-3 bg-gray-900 text-gray-200 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(createZone.data, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}