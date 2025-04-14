
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReportsPage() {
  // נתוני דוגמה לגרף - במערכת אמיתית יגיעו מהשרת
  const attendanceData = [
    { name: 'ינואר', totalHours: 168, expectedHours: 176 },
    { name: 'פברואר', totalHours: 160, expectedHours: 160 },
    { name: 'מרץ', totalHours: 184, expectedHours: 176 },
    { name: 'אפריל', totalHours: 170, expectedHours: 168 },
    { name: 'מאי', totalHours: 172, expectedHours: 176 },
    { name: 'יוני', totalHours: 168, expectedHours: 168 },
  ];

  const reportOptions = [
    { id: 1, title: "דוח נוכחות חודשי", description: "סיכום שעות לעובד לפי חודש" },
    { id: 2, title: "דוח חריגות", description: "דיווח על איחורים וחריגות בשעות" },
    { id: 3, title: "דוח חופשות", description: "סיכום ימי חופשה וימי מחלה" },
    { id: 4, title: "דוח לפי מחלקות", description: "סיכום שעות לפי מחלקות" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">דוחות וניתוחים</h1>
          <Button variant="outline" asChild>
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>סיכום שעות עבודה - 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-80 w-full" config={{}}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalHours" name="שעות בפועל" fill="#8884d8" />
                  <Bar dataKey="expectedHours" name="שעות מתוכננות" fill="#82ca9d" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>סיכום חודש אחרון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">סה״כ שעות</div>
                  <div className="text-2xl font-semibold">172 שעות</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">ימי נוכחות</div>
                  <div className="text-2xl font-semibold">21 ימים</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-500">ימי חופשה</div>
                  <div className="text-2xl font-semibold">2 ימים</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>דוחות זמינים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportOptions.map((report) => (
                <Button 
                  key={report.id}
                  variant="outline" 
                  className="h-auto p-4 justify-start text-right"
                >
                  <div>
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
