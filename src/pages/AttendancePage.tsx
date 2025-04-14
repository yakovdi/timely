
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockedIn(true);
    console.log("Clocked in at:", now);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setClockedIn(false);
    console.log("Clocked out at:", now);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
            <CardTitle className="text-2xl">{formatDate(currentTime)}</CardTitle>
            <div className="text-4xl font-mono mt-2">{formatTime(currentTime)}</div>
          </CardHeader>
          <CardContent className="flex justify-center gap-6">
            <Button 
              className="flex gap-2 h-16 w-32 text-lg" 
              disabled={clockedIn}
              onClick={handleClockIn}
            >
              <LogIn size={20} />
              כניסה
            </Button>
            <Button 
              className="flex gap-2 h-16 w-32 text-lg" 
              variant="destructive"
              disabled={!clockedIn} 
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
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" /> צפייה בהיסטוריית נוכחות
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
