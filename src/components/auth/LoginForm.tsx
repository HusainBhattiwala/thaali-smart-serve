
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess?: (isAdmin: boolean) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [itsId, setItsId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate ITS ID format (8 digits)
      if (!/^\d{8}$/.test(itsId)) {
        toast.error("ITS ID must be an 8-digit number");
        setIsLoading(false);
        return;
      }

      // Check if user exists in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('its_id', itsId)
        .single();

      if (error || !data) {
        toast.error("User not found");
        setIsLoading(false);
        return;
      }

      // If user is admin, show password field
      if (data.role === 'admin') {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // For regular users, log them in directly
      const userData = {
        itsId: itsId,
        role: data.role,
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
      // For admin, verify password
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('its_id', itsId)
        .eq('password', password) // Note: In a real app, use proper password hashing
        .single();

      if (error || !data) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify({ 
        itsId: data.its_id, 
        role: data.role 
      }));

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
    <form onSubmit={isAdmin ? handleAdminLogin : handleCheckUser} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="itsId">ITS ID</Label>
        <Input
          id="itsId"
          placeholder="Enter your 8-digit ITS ID"
          value={itsId}
          onChange={(e) => setItsId(e.target.value)}
          className="thaali-input"
          required
        />
      </div>
      
      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="password">Admin Password</Label>
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
      )}
      
      <Button
        type="submit"
        className="w-full bg-thaali-green hover:bg-thaali-green-dark"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : isAdmin ? "Admin Login" : "Login"}
      </Button>

      {isAdmin && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsAdmin(false)}
        >
          Back to Regular Login
        </Button>
      )}
    </form>
  );
};

export default LoginForm;
