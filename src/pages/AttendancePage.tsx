
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { users } from "@/data/users";
import { AttendanceRecord } from "@/types/attendance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendanceHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
  }, [attendanceHistory]);

  const handleClockIn = () => {
    if (!selectedUserId) return;
    
    const now = new Date();
    setClockInTime(now);
    setClockedIn(true);
    
    const record: AttendanceRecord = {
      id: Date.now(),
      userId: Number(selectedUserId),
      userName: users.find(u => u.id === Number(selectedUserId))?.name || '',
      type: 'clockIn',
      timestamp: now
    };
    
    setAttendanceHistory(prev => [...prev, record]);
  };

  const handleClockOut = () => {
    if (!selectedUserId) return;
    
    const now = new Date();
    setClockOutTime(now);
    setClockedIn(false);
    
    const record: AttendanceRecord = {
      id: Date.now(),
      userId: Number(selectedUserId),
      userName: users.find(u => u.id === Number(selectedUserId))?.name || '',
      type: 'clockOut',
      timestamp: now
    };
    
    setAttendanceHistory(prev => [...prev, record]);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('he-IL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUserAttendanceHistory = () => {
    if (!selectedUserId) return [];
    return attendanceHistory
      .filter(record => record.userId === Number(selectedUserId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">דיווח נוכחות</h1>
          <Button variant="outline" asChild>
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl space-y-4">
              <div>{formatDate(currentTime)}</div>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר משתמש" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-4xl font-mono mt-2">{formatTime(currentTime)}</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center gap-6">
            <Button 
              className="flex gap-2 h-16 w-32 text-lg" 
              disabled={!selectedUserId || clockedIn}
              onClick={handleClockIn}
            >
              <LogIn size={20} />
              כניסה
            </Button>
            <Button 
              className="flex gap-2 h-16 w-32 text-lg" 
              variant="destructive"
              disabled={!selectedUserId || !clockedIn}
              onClick={handleClockOut}
            >
              <LogOut size={20} />
              יציאה
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>סיכום היום</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">שעת כניסה</div>
                  <div className="text-lg font-semibold">
                    {clockInTime ? formatTime(clockInTime) : 'לא דווח'}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">שעת יציאה</div>
                  <div className="text-lg font-semibold">
                    {clockOutTime ? formatTime(clockOutTime) : 'לא דווח'}
                  </div>
                </div>
              </div>

              {clockInTime && clockOutTime && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">סה״כ שעות</div>
                  <div className="text-lg font-semibold">
                    {((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2)} שעות
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Clock className="mr-2 h-4 w-4" /> צפייה בהיסטוריית נוכחות
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>היסטוריית נוכחות</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>תאריך</TableHead>
                            <TableHead>שעה</TableHead>
                            <TableHead>סוג דיווח</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getUserAttendanceHistory().map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{formatDate(new Date(record.timestamp))}</TableCell>
                              <TableCell>{formatTime(new Date(record.timestamp))}</TableCell>
                              <TableCell>{record.type === 'clockIn' ? 'כניסה' : 'יציאה'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
