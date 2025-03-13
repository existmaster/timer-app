export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: string;
  activity: string;
  subActivities?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  triggered: boolean;
} 