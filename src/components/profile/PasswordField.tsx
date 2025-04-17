
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  required?: boolean;
}

const PasswordField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  showToggle = false,
  required = false
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          className="thaali-input pr-10"
          required={required}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
