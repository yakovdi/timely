
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { AttendanceRecord } from "@/types/attendance";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { toast } from "sonner";

export default function ReportsPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
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

  useEffect(() => {
    // טעינת רשומות נוכחות מהלוקל סטורג'
    const savedRecords = localStorage.getItem("attendanceRecords");
    if (savedRecords) {
      // המרת תאריכים מחזרה מ-JSON
      const records: AttendanceRecord[] = JSON.parse(savedRecords).map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
      setAttendanceRecords(records);
    }
  }, []);

  // חישוב מדדים לדוח
  const totalRecords = attendanceRecords.length;
  const approvedRecords = attendanceRecords.filter(record => record.approved).length;
  const unapprovedRecords = totalRecords - approvedRecords;
  
  // חישוב מספר הדפים
  const totalPages = Math.ceil(attendanceRecords.length / recordsPerPage);
  
  // מיון הרשומות לפי תאריך (מהחדש לישן)
  const sortedRecords = [...attendanceRecords].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  // הרשומות בדף הנוכחי
  const currentRecords = sortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  
  // פורמט התאריך והשעה
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // אישור רשומות נוכחות
  const approveRecord = (recordId: number) => {
    const updatedRecords = attendanceRecords.map(record => 
      record.id === recordId ? { ...record, approved: true } : record
    );
    
    setAttendanceRecords(updatedRecords);
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    toast.success("הרשומה אושרה בהצלחה");
  };

  const handleReportClick = (reportId: number) => {
    toast.success(`דוח מספר ${reportId} נפתח בהצלחה`);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">דוחות וניתוחים</h1>
          <Button variant="outline" asChild>
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </div>

        <Tabs defaultValue="summary" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="summary">סיכום נתונים</TabsTrigger>
            <TabsTrigger value="attendance">היסטוריית נוכחות</TabsTrigger>
            <TabsTrigger value="reports">דוחות מובנים</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>סיכום שעות עבודה - 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-80 w-full" config={{}}>
                    <ResponsiveContainer>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalHours" name="שעות בפועל" fill="#8884d8" />
                        <Bar dataKey="expectedHours" name="שעות מתוכננות" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>סיכום נוכחות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-500">סה״כ רשומות נוכחות</div>
                      <div className="text-2xl font-semibold">{totalRecords}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-500">רשומות מאושרות</div>
                      <div className="text-2xl font-semibold">{approvedRecords}</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-500">רשומות לא מאושרות</div>
                      <div className="text-2xl font-semibold">{unapprovedRecords}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית נוכחות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>משתמש</TableHead>
                        <TableHead>סוג</TableHead>
                        <TableHead>תאריך ושעה</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRecords.length > 0 ? currentRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.userName}</TableCell>
                          <TableCell>
                            {record.type === 'clockIn' ? 'כניסה' : 'יציאה'}
                          </TableCell>
                          <TableCell>{formatDateTime(record.timestamp)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.approved ? 'מאושר' : 'ממתין לאישור'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {!record.approved && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => approveRecord(record.id)}
                              >
                                אשר
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            אין רשומות נוכחות להצגה
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalRecords > recordsPerPage && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, array) => {
                          if (index > 0 && array[index - 1] !== page - 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <PaginationItem>
                                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                                </PaginationItem>
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={page === currentPage}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                            );
                          }
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })
                      }
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>דוחות זמינים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportOptions.map((report) => (
                    <Dialog key={report.id}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-auto p-4 justify-start text-right w-full"
                          onClick={() => handleReportClick(report.id)}
                        >
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground">{report.description}</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{report.title}</DialogTitle>
                          <DialogDescription>{report.description}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h3 className="text-lg font-medium">נתוני דוגמה</h3>
                          <div className="mt-4 rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>שם העובד</TableHead>
                                  <TableHead>שעות</TableHead>
                                  <TableHead>חברה</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {[1, 2, 3].map((index) => (
                                  <TableRow key={index}>
                                    <TableCell>עובד לדוגמה {index}</TableCell>
                                    <TableCell>{120 + (index * 10)}</TableCell>
                                    <TableCell>חברה {Math.ceil(index/2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
