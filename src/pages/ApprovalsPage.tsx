
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

export default function ApprovalsPage() {
  // מידע לדוגמה - במערכת אמיתית זה יגיע מהשרת
  const attendanceData = [
    { 
      id: 1, 
      name: 'ישראל ישראלי', 
      date: '2025-04-14', 
      clockIn: '08:30', 
      clockOut: '17:00', 
      totalHours: '8.5', 
      status: 'ממתין לאישור' 
    },
    { 
      id: 2, 
      name: 'יעקב יעקובי', 
      date: '2025-04-14', 
      clockIn: '09:15', 
      clockOut: '18:30', 
      totalHours: '9.25', 
      status: 'ממתין לאישור' 
    },
    { 
      id: 3, 
      name: 'שרה כהן', 
      date: '2025-04-14', 
      clockIn: '08:00', 
      clockOut: '16:45', 
      totalHours: '8.75', 
      status: 'ממתין לאישור' 
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">אישור דיווחי נוכחות</h1>
          <Button variant="outline" asChild>
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>דיווחים ממתינים לאישור</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם העובד</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>כניסה</TableHead>
                  <TableHead>יציאה</TableHead>
                  <TableHead>סה״כ שעות</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>{item.clockIn}</TableCell>
                    <TableCell>{item.clockOut}</TableCell>
                    <TableCell>{item.totalHours}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
