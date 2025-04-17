
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThaaliChangeReport from "@/components/admin/ThaaliChangeReport";
import { Users, UtensilsCrossed, CalendarDays } from "lucide-react";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  if (!user) return null;
  
  // Stats for demo purposes
  const stats = [
    {
      title: "Total Users",
      value: "120",
      icon: Users,
      color: "text-thaali-green bg-thaali-green/10"
    },
    {
      title: "Active Thaalis",
      value: "105",
      icon: UtensilsCrossed,
      color: "text-thaali-gold bg-thaali-gold/10"
    },
    {
      title: "Today's Changes",
      value: "12",
      icon: CalendarDays,
      color: "text-blue-500 bg-blue-50"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="thaali-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold">{stat.value}</span>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <ThaaliChangeReport />
    </div>
  );
};

export default AdminDashboard;
