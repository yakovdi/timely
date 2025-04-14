
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { users as initialUsers } from "@/data/users";
import { companies as initialCompanies } from "@/data/companies";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Company, SystemSettings } from "@/types/attendance";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronDown, Pencil, Plus, Trash, UserPlus } from "lucide-react";

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    workDayStart: "08:00",
    workDayEnd: "17:00",
    workWeekDays: 5,
    requireManagerApproval: false,
    allowRetroactiveUpdate: true,
    allowReportViewing: false,
  });
  
  // Company form schema
  const companyFormSchema = z.object({
    name: z.string().min(1, { message: "נדרש שם חברה" }),
    registrationNumber: z.string().optional(),
    email: z.string().email({ message: "נדרשת כתובת אימייל תקינה" }).optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
  });

  // User form schema
  const userFormSchema = z.object({
    name: z.string().min(1, { message: "נדרש שם משתמש" }),
    email: z.string().email({ message: "נדרשת כתובת אימייל תקינה" }).optional().or(z.literal('')),
    phone: z.string().optional(),
    role: z.string().optional(),
    companyId: z.number(),
  });

  // Company form
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // User form
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      companyId: companies.length > 0 ? companies[0].id : 1,
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedCompanies = localStorage.getItem("companies");
    const savedSettings = localStorage.getItem("systemSettings");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      setCompanies(initialCompanies);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("systemSettings", JSON.stringify(settings));
  }, [settings]);

  // Filter users by selected company
  const filteredUsers = selectedCompanyId 
    ? users.filter(user => user.companyId === selectedCompanyId)
    : users;

  // Add new company
  const handleAddCompany = (data: z.infer<typeof companyFormSchema>) => {
    const newCompany: Company = {
      id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1,
      name: data.name,
      active: true,
      registrationNumber: data.registrationNumber,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    
    setCompanies([...companies, newCompany]);
    companyForm.reset();
    toast.success("החברה נוספה בהצלחה");
  };

  // Add new user
  const handleAddUser = (data: z.infer<typeof userFormSchema>) => {
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: data.name,
      active: true,
      companyId: data.companyId,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    
    setUsers([...users, newUser]);
    userForm.reset();
    toast.success("המשתמש נוסף בהצלחה");
  };

  // Update user company
  const changeUserCompany = (userId: number, newCompanyId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, companyId: newCompanyId }
        : user
    ));
    toast.success("שיוך המשתמש עודכן בהצלחה");
  };

  // Delete user
  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("המשתמש נמחק בהצלחה");
  };

  // Delete company
  const deleteCompany = (companyId: number) => {
    // Check if company has users
    const hasUsers = users.some(user => user.companyId === companyId);
    
    if (hasUsers) {
      toast.error("לא ניתן למחוק חברה שיש לה משתמשים");
      return;
    }
    
    setCompanies(companies.filter(company => company.id !== companyId));
    toast.success("החברה נמחקה בהצלחה");
  };

  // Save company details
  const saveCompanyDetails = (companyData: Partial<Company>) => {
    setCompanies(companies.map(company => 
      company.id === companyData.id 
        ? { ...company, ...companyData }
        : company
    ));
    toast.success("פרטי החברה נשמרו בהצלחה");
  };

  // Save system settings
  const saveSystemSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings));
    toast.success("הגדרות המערכת נשמרו בהצלחה");
  };

  // Toggle setting switches
  const toggleSetting = (setting: keyof SystemSettings) => {
    setSettings(prev => ({ 
      ...prev, 
      [setting]: !prev[setting] 
    }));
  };

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
            <TabsTrigger value="company">ניהול חברות</TabsTrigger>
            <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="permissions">הרשאות</TabsTrigger>
            <TabsTrigger value="system">הגדרות מערכת</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>ניהול חברות</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      הוספת חברה חדשה
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>הוספת חברה חדשה</DialogTitle>
                      <DialogDescription>הזן את פרטי החברה החדשה</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={companyForm.handleSubmit(handleAddCompany)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">שם החברה*</Label>
                        <Input 
                          id="companyName" 
                          placeholder="הזן שם חברה" 
                          {...companyForm.register("name")} 
                        />
                        {companyForm.formState.errors.name && (
                          <p className="text-sm text-red-500">{companyForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyId">ח.פ / מס' עוסק</Label>
                        <Input 
                          id="companyId" 
                          placeholder="הזן מספר חברה" 
                          {...companyForm.register("registrationNumber")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">דוא״ל</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="דוא״ל" 
                          {...companyForm.register("email")}
                        />
                        {companyForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{companyForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">טלפון</Label>
                        <Input 
                          id="phone" 
                          placeholder="טלפון" 
                          {...companyForm.register("phone")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">כתובת</Label>
                        <Input 
                          id="address" 
                          placeholder="כתובת החברה" 
                          {...companyForm.register("address")}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit">הוסף חברה</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">ביטול</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם החברה</TableHead>
                        <TableHead>ח.פ / מס' עוסק</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell>{company.registrationNumber || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${company.active ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                              {company.active ? "פעיל" : "לא פעיל"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>עריכת פרטי חברה</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-name-${company.id}`}>שם החברה</Label>
                                      <Input 
                                        id={`edit-name-${company.id}`}
                                        defaultValue={company.name}
                                        onChange={(e) => company.name = e.target.value}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-reg-${company.id}`}>ח.פ / מס' עוסק</Label>
                                      <Input 
                                        id={`edit-reg-${company.id}`}
                                        defaultValue={company.registrationNumber || ""}
                                        onChange={(e) => company.registrationNumber = e.target.value}
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Label htmlFor={`edit-active-${company.id}`}>סטטוס פעיל</Label>
                                      <Switch 
                                        id={`edit-active-${company.id}`}
                                        checked={company.active}
                                        onCheckedChange={(checked) => company.active = checked}
                                      />
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button onClick={() => saveCompanyDetails(company)}>
                                          שמור שינויים
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => deleteCompany(company.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {companies.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            אין חברות להצגה
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle>ניהול משתמשים</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="mr-2">
                        {selectedCompanyId 
                          ? companies.find(c => c.id === selectedCompanyId)?.name || 'כל החברות' 
                          : 'כל החברות'}
                        <ChevronDown className="mr-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedCompanyId(null)}>
                        כל החברות
                      </DropdownMenuItem>
                      {companies.map((company) => (
                        <DropdownMenuItem 
                          key={company.id}
                          onClick={() => setSelectedCompanyId(company.id)}
                        >
                          {company.name}
                          {selectedCompanyId === company.id && <Check className="mr-2 h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      הוספת משתמש חדש
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>הוספת משתמש חדש</DialogTitle>
                      <DialogDescription>הזן את פרטי המשתמש החדש</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={userForm.handleSubmit(handleAddUser)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">שם המשתמש*</Label>
                        <Input 
                          id="userName" 
                          placeholder="הזן שם מלא" 
                          {...userForm.register("name")} 
                        />
                        {userForm.formState.errors.name && (
                          <p className="text-sm text-red-500">{userForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="userRole">תפקיד</Label>
                        <Input 
                          id="userRole" 
                          placeholder="הזן תפקיד" 
                          {...userForm.register("role")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userEmail">דוא״ל</Label>
                        <Input 
                          id="userEmail" 
                          type="email" 
                          placeholder="דוא״ל" 
                          {...userForm.register("email")}
                        />
                        {userForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{userForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userPhone">טלפון</Label>
                        <Input 
                          id="userPhone" 
                          placeholder="טלפון" 
                          {...userForm.register("phone")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userCompany">חברה</Label>
                        <select 
                          id="userCompany"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...userForm.register("companyId", { valueAsNumber: true })}
                        >
                          {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <DialogFooter>
                        <Button type="submit">הוסף משתמש</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">ביטול</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם משתמש</TableHead>
                        <TableHead>תפקיד</TableHead>
                        <TableHead>חברה</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead>פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.role || "לא הוגדר"}</TableCell>
                          <TableCell>
                            {companies.find(c => c.id === user.companyId)?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${user.active ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                              {user.active ? "פעיל" : "לא פעיל"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    שינוי חברה
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {companies.map((company) => (
                                    <DropdownMenuItem 
                                      key={company.id}
                                      onClick={() => changeUserCompany(user.id, company.id)}
                                      disabled={user.companyId === company.id}
                                    >
                                      {company.name}
                                      {user.companyId === company.id && <Check className="mr-2 h-4 w-4" />}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            אין משתמשים להצגה
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                        <Switch 
                          checked={settings.requireManagerApproval} 
                          onCheckedChange={() => toggleSetting('requireManagerApproval')}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">עדכון שעות בדיעבד</div>
                          <div className="text-sm text-slate-500">האם משתמשים יכולים לעדכן שעות עבודה בדיעבד</div>
                        </div>
                        <Switch 
                          checked={settings.allowRetroactiveUpdate} 
                          onCheckedChange={() => toggleSetting('allowRetroactiveUpdate')}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">צפייה בדוחות מערכת</div>
                          <div className="text-sm text-slate-500">האם משתמשים רגילים יכולים לצפות בדוחות מערכת</div>
                        </div>
                        <Switch 
                          checked={settings.allowReportViewing}
                          onCheckedChange={() => toggleSetting('allowReportViewing')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveSystemSettings}>שמור הגדרות</Button>
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
                      <Input 
                        id="workDayStart" 
                        type="time" 
                        value={settings.workDayStart}
                        onChange={(e) => setSettings({...settings, workDayStart: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workDayEnd">שעת סיום יום עבודה</Label>
                      <Input 
                        id="workDayEnd" 
                        type="time"
                        value={settings.workDayEnd}
                        onChange={(e) => setSettings({...settings, workDayEnd: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workWeekDays">ימי עבודה בשבוע</Label>
                      <Input 
                        id="workWeekDays" 
                        type="number" 
                        min="1" 
                        max="7"
                        value={settings.workWeekDays}
                        onChange={(e) => setSettings({...settings, workWeekDays: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveSystemSettings}>שמור הגדרות</Button>
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
