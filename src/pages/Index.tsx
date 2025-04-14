
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserCheck, PieChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">מערכת דיווח נוכחות</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          מערכת מתקדמת לניהול נוכחות עובדים, דיווח שעות ומעקב אחר חופשות
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto flex-grow">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>דיווח נוכחות</CardTitle>
            <CardDescription>רישום כניסה ויציאה ועדכון שעות</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500">דווח על שעות העבודה שלך בקלות באמצעות המערכת המקוונת</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/attendance">כניסה למערכת</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>אישור שעות</CardTitle>
            <CardDescription>אישור דיווחי שעות לעובדים</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500">אשר או עדכן דיווחי שעות של העובדים שלך</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/approvals">אישור שעות</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <PieChart className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>דוחות וניתוחים</CardTitle>
            <CardDescription>הפקת דוחות וניתוח נתונים</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500">צפה בדוחות מפורטים על נוכחות, חופשות וכו׳</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/reports">דוחות</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle>הגדרות מערכת</CardTitle>
            <CardDescription>ניהול משתמשים והרשאות</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500">הגדר משתמשים, הרשאות ואפשרויות נוספות</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/settings">הגדרות</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} מערכת דיווח נוכחות. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
}
