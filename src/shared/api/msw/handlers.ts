import { dormitoryHandlers } from '@/entities/dormitory/api/dormitory.handlers';
import { homebaseHandlers } from '@/features/homebase/api/homebase.handlers';

export const handlers = [...dormitoryHandlers, ...homebaseHandlers];
