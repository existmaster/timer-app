import { TimeSlot } from '../types';

export const timetableData: TimeSlot[] = [
  {
    startTime: '08:30',
    endTime: '09:10',
    duration: '40min',
    activity: '',
  },
  {
    startTime: '09:10',
    endTime: '09:25',
    duration: '15min',
    activity: '쉬는 시간',
  },
  {
    startTime: '09:25',
    endTime: '10:05',
    duration: '40min',
    activity: '',
  },
  {
    startTime: '10:05',
    endTime: '10:15',
    duration: '10min',
    activity: '쉬는 시간',
  },
  {
    startTime: '10:15',
    endTime: '10:55',
    duration: '40min',
    activity: '',
  },
  {
    startTime: '10:55',
    endTime: '11:05',
    duration: '10min',
    activity: '쉬는 시간',
  },
  {
    startTime: '11:05',
    endTime: '11:50',
    duration: '45min',
    activity: '',
  },
  {
    startTime: '11:50',
    endTime: '13:00',
    duration: '70min',
    activity: '점심시간',
  },
  {
    startTime: '13:00',
    endTime: '13:30',
    duration: '30min',
    activity: '',
    subActivities: {
      monday: '스트레칭(월)',
      wednesday: '선배와의 대화(수)',
      friday: '조별 활동(금)',
    },
  },
  {
    startTime: '13:40',
    endTime: '14:30',
    duration: '50min',
    activity: '',
  },
  {
    startTime: '14:30',
    endTime: '14:40',
    duration: '10min',
    activity: '쉬는 시간',
  },
  {
    startTime: '14:40',
    endTime: '15:30',
    duration: '50min',
    activity: '',
  },
  {
    startTime: '15:30',
    endTime: '15:40',
    duration: '10min',
    activity: '쉬는 시간',
  },
  {
    startTime: '15:40',
    endTime: '16:30',
    duration: '50min',
    activity: '',
  },
  {
    startTime: '16:30',
    endTime: '16:40',
    duration: '10min',
    activity: '쉬는 시간',
  },
  {
    startTime: '16:40',
    endTime: '17:30',
    duration: '50min',
    activity: '',
  },
]; 