
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginFormProps {
  onSuccess?: (isAdmin: boolean) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [itsId, setItsId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${itsId}@mythaali.com`, // Using ITS ID as email
        password: password
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      // Fetch user role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('its_id', itsId)
        .single();

      if (profileError) {
        toast.error("Could not fetch user profile");
        setIsLoading(false);
        return;
      }

      const isAdmin = profileData?.role === 'admin';

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ 
        itsId, 
        name: data.user?.user_metadata?.name || "User", 
        role: profileData?.role || "user", 
        thaaliType: data.user?.user_metadata?.thaaliType || "Medium"
      }));

      if (isAdmin) {
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
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="thaali-input pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
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
