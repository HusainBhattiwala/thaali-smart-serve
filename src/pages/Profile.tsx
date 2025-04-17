
import { useState, useEffect } from "react";
import UserProfile from "@/components/profile/UserProfile";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('its_id', userData.itsId)
            .single();

          if (error) {
            toast.error("Could not fetch user profile");
            return;
          }

          setUser({
            ...userData,
            phone: data?.phone,
            thaaliType: data?.thaali_type
          });
        } catch (error) {
          toast.error("An error occurred while fetching profile");
        }
      }
    };

    fetchUserProfile();
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
