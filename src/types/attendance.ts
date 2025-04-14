
export interface User {
  id: number;
  name: string;
  active: boolean;
  companyId: number;
  email?: string;
  phone?: string;
  role?: string;
}

export interface Company {
  id: number;
  name: string;
  active: boolean;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface AttendanceRecord {
  id: number;
  userId: number;
  userName: string;
  type: 'clockIn' | 'clockOut';
  timestamp: Date;
  approved: boolean;
}

export type SystemSettings = {
  workDayStart: string;
  workDayEnd: string;
  workWeekDays: number;
  requireManagerApproval: boolean;
  allowRetroactiveUpdate: boolean;
  allowReportViewing: boolean;
};
