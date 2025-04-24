
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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
        .select('*')
        .eq('its_id', itsId)
        .single();

      if (error || !data) {
        toast.error("User not found");
        setIsLoading(false);
        return;
      }

      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify({ 
        itsId: data.its_id, 
        name: data.name, 
        role: data.role, 
        thaaliType: data.thaali_type
      }));

      // Navigate based on user role
      if (data.role === 'admin') {
        toast.success("Admin login successful");
        navigate("/admin");
        if (onSuccess) onSuccess(true);
      } else {
        toast.success("Login successful");
        navigate("/dashboard");
        if (onSuccess) onSuccess(false);
      }
      
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 w-full max-w-sm">
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
      
      <Button
        type="submit"
        className="w-full bg-thaali-green hover:bg-thaali-green-dark"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
