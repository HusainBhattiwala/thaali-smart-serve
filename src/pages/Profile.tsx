
import { useState, useEffect } from "react";
import UserProfile from "@/components/profile/UserProfile";

const Profile = () => {
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
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <UserProfile user={user} />
    </div>
  );
};

export default Profile;
