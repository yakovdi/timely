
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, QrCode, UserCheck } from "lucide-react";

export default function KioskPage() {
  const [userId, setUserId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [action, setAction] = useState<"in" | "out">("in");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setUserId("");
      }, 3000);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Clock className="h-16 w-16 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">מערכת דיווח נוכחות</h1>
          
          <Tabs defaultValue="id" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="id">הזנת מספר עובד</TabsTrigger>
              <TabsTrigger value="qr">סריקת QR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="id">
              {showSuccess ? (
                <div className="py-8 text-center">
                  <UserCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-green-700">
                    {action === "in" ? "כניסה נרשמה בהצלחה!" : "יציאה נרשמה בהצלחה!"}
                  </h2>
                  <p className="text-slate-600 mt-2">תודה, המערכת עודכנה.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId">מספר עובד / תעודת זהות</Label>
                      <Input
                        id="userId"
                        placeholder="הזן מספר מזהה"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>בחר פעולה</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={action === "in" ? "default" : "outline"}
                          className="h-16"
                          onClick={() => setAction("in")}
                        >
                          כניסה
                        </Button>
                        <Button
                          type="button"
                          variant={action === "out" ? "default" : "outline"}
                          className="h-16"
                          onClick={() => setAction("out")}
                        >
                          יציאה
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full h-14 text-lg">
                      אישור
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="qr">
              <div className="py-8 text-center">
                <QrCode className="h-32 w-32 mx-auto mb-4" />
                <h2 className="text-xl font-bold">סרוק את קוד ה-QR</h2>
                <p className="text-slate-600 mt-2">קרב את הקוד למצלמה לדיווח מהיר</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <p className="text-center text-xs text-slate-500 mt-4">
            © {new Date().getFullYear()} מערכת דיווח נוכחות
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
