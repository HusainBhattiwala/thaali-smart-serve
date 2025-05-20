
import { useState, useEffect } from "react";
import ThaaliInfo from "@/components/dashboard/ThaaliInfo";
import MenuDisplay from "@/components/dashboard/MenuDisplay";
import ThaaliChangeRequest from "@/components/dashboard/ThaaliChangeRequest";
import ThaaliRatingForm from "@/components/dashboard/ThaaliRatingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ThaaliInfo 
            thaaliType={user.thaaliType} 
            userId={user.itsId} 
            userName={user.name} 
          />
          <MenuDisplay />
        </div>
        
        <div>
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Change Request</TabsTrigger>
              <TabsTrigger value="feedback">Rate Thaali</TabsTrigger>
            </TabsList>
            <TabsContent value="request">
              <ThaaliChangeRequest />
            </TabsContent>
            <TabsContent value="feedback">
              <ThaaliRatingForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
