
export interface User {
  id: number;
  name: string;
  active: boolean;
}

export interface AttendanceRecord {
  id: number;
  userId: number;
  userName: string;
  type: 'clockIn' | 'clockOut';
  timestamp: Date;
}
