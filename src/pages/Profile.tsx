
import { useState, useEffect } from "react";
import UserProfile from "@/components/profile/UserProfile";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      // Check if Supabase connection is working
      const isConnected = await checkSupabaseConnection();
      
      if (!isConnected) {
        setConnectionError(true);
        setLoading(false);
        return;
      }
      
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
            console.error("Profile fetch error:", error);
            
            // Use fallback data when we can't fetch from Supabase
            setUser({
              ...userData,
              phone: "",
              thaaliType: userData.thaaliType || "Small" // Provide a fallback
            });
          } else {
            setUser({
              ...userData,
              phone: data?.phone,
              thaaliType: data?.thaali_type || userData.thaaliType || "Small"
            });
          }
        } catch (error) {
          console.error("Profile fetch exception:", error);
          toast.error("An error occurred while fetching profile");
          
          // Use fallback data
          setUser({
            ...userData,
            phone: "",
            thaaliType: userData.thaaliType || "Small"
          });
        }
      }
      
      setLoading(false);
    };

    fetchUserProfile();
  }, []);
  
  if (connectionError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not connect to Supabase. Please check your Supabase configuration or try again later.
          </AlertDescription>
        </Alert>
        
        {/* Show dummy profile if user data exists in localStorage */}
        {localStorage.getItem("user") && (
          <UserProfile 
            user={{
              ...JSON.parse(localStorage.getItem("user") || "{}"),
              thaaliType: JSON.parse(localStorage.getItem("user") || "{}")?.thaaliType || "Small",
              phone: ""
            }} 
          />
        )}
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>Loading profile information...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Not Logged In</AlertTitle>
          <AlertDescription>
            Please log in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <UserProfile user={user} />
    </div>
  );
};

export default Profile;
