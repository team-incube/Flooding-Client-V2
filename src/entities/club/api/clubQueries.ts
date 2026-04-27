import { queryOptions } from '@tanstack/react-query';
import { getClubs } from './getClubs';
import { getClubDetail } from './getClub';

export const clubQueries = {
  list: () =>
    queryOptions({
      queryKey: ['club', 'list'],
      queryFn: getClubs,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ['club', 'detail', id],
      queryFn: () => getClubDetail(id),
    }),
} as const;
