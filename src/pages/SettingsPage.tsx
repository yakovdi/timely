
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">הגדרות מערכת</h1>
          <Button variant="outline" asChild>
            <Link to="/">חזרה לדף הבית</Link>
          </Button>
        </div>

        <Tabs defaultValue="company" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="company">פרטי חברה</TabsTrigger>
            <TabsTrigger value="users">משתמשים</TabsTrigger>
            <TabsTrigger value="permissions">הרשאות</TabsTrigger>
            <TabsTrigger value="system">הגדרות מערכת</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>פרטי חברה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">שם החברה</Label>
                    <Input id="companyName" placeholder="הזן את שם החברה" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyId">ח.פ / מס' עוסק</Label>
                    <Input id="companyId" placeholder="הזן מספר חברה" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">דוא״ל</Label>
                    <Input id="email" type="email" placeholder="דוא״ל" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input id="phone" placeholder="טלפון" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">כתובת</Label>
                  <Input id="address" placeholder="כתובת החברה" />
                </div>

                <div className="flex justify-end">
                  <Button>שמור שינויים</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>ניהול משתמשים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button>הוספת משתמש חדש</Button>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium">
                    <div>שם משתמש</div>
                    <div>תפקיד</div>
                    <div>דוא״ל</div>
                    <div>סטטוס</div>
                  </div>
                  {[1, 2, 3].map((user) => (
                    <div key={user} className="grid grid-cols-4 p-4 border-t">
                      <div>משתמש {user}</div>
                      <div>מנהל מערכת</div>
                      <div>user{user}@example.com</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        פעיל
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>ניהול הרשאות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">אישור נוכחות ע״י מנהל</div>
                          <div className="text-sm text-slate-500">האם דיווחי הנוכחות דורשים אישור מנהל</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">עדכון שעות בדיעבד</div>
                          <div className="text-sm text-slate-500">האם משתמשים יכולים לעדכן שעות עבודה בדיעבד</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">צפייה בדוחות מערכת</div>
                          <div className="text-sm text-slate-500">האם משתמשים רגילים יכולים לצפות בדוחות מערכת</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>שמור הגדרות</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>הגדרות מערכת כלליות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="workDayStart">שעת תחילת יום עבודה</Label>
                      <Input id="workDayStart" type="time" defaultValue="08:00" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workDayEnd">שעת סיום יום עבודה</Label>
                      <Input id="workDayEnd" type="time" defaultValue="17:00" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workWeekDays">ימי עבודה בשבוע</Label>
                      <Input id="workWeekDays" type="number" min="1" max="7" defaultValue="5" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>שמור הגדרות</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
