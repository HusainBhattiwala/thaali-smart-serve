
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import PasswordField from "./PasswordField";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsPasswordChanging(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordChanging(false);
    }, 1000);
  };
  
  return (
    <Card className="thaali-card">
      <CardHeader className="bg-thaali-green/10">
        <CardTitle className="text-lg">Change Password</CardTitle>
        <CardDescription>
          Enter your current password and a new password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handlePasswordChange}>
        <CardContent className="pt-4 space-y-4">
          <PasswordField
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            showToggle={true}
            required={true}
          />
          
          <PasswordField
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showToggle={true}
            required={true}
          />
          
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
          />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-thaali-green hover:bg-thaali-green-dark"
            disabled={isPasswordChanging}
          >
            {isPasswordChanging ? "Changing..." : "Change Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;
