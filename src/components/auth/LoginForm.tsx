
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess?: (isAdmin: boolean) => void;
}

// Define UserRole as a string literal type
type UserRole = 'admin' | 'user';

// Explicitly define the shape of user data to avoid recursive type issues
interface UserData {
  itsId: string;
  role: UserRole;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [userItsId, setUserItsId] = useState("");
  const [adminItsId, setAdminItsId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!/^\d{8}$/.test(userItsId)) {
        toast.error("ITS ID must be an 8-digit number");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('its_id', userItsId)
        .maybeSingle();

      if (error || !data || data.role === 'admin') {
        toast.error("Invalid ITS ID or not a regular user");
        setIsLoading(false);
        return;
      }

      // Create a properly typed user data object
      const userData: UserData = {
        itsId: userItsId,
        role: data.role as UserRole,
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful");
      if (onSuccess) onSuccess(false);
      navigate("/dashboard");
      
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('its_id', adminItsId)
        .eq('password', password)
        .maybeSingle();

      if (error || !data || data.role !== 'admin') {
        toast.error("Invalid admin credentials");
        setIsLoading(false);
        return;
      }

      // Create a properly typed user data object
      const userData: UserData = {
        itsId: data.its_id,
        role: data.role as UserRole,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Admin login successful");
      if (onSuccess) onSuccess(true);
      navigate("/admin");
      
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="user" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="user">User Login</TabsTrigger>
        <TabsTrigger value="admin">Admin Login</TabsTrigger>
      </TabsList>
      
      <TabsContent value="user">
        <form onSubmit={handleUserLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userItsId">ITS ID</Label>
            <Input
              id="userItsId"
              placeholder="Enter your 8-digit ITS ID"
              value={userItsId}
              onChange={(e) => setUserItsId(e.target.value)}
              className="thaali-input"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-thaali-green hover:bg-thaali-green-dark"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="admin">
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="adminItsId">Admin ITS ID</Label>
            <Input
              id="adminItsId"
              placeholder="Enter admin ITS ID"
              value={adminItsId}
              onChange={(e) => setAdminItsId(e.target.value)}
              className="thaali-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="thaali-input"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-thaali-green hover:bg-thaali-green-dark"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Admin Login"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
