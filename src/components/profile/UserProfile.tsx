
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, EyeOff, User } from "lucide-react";

interface UserProfileProps {
  user: {
    itsId: string;
    name: string;
    thaaliType: string;
    phone?: string;
  };
}

const UserProfile = ({ user }: UserProfileProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(user.phone || "");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [isPhoneChanging, setIsPhoneChanging] = useState(false);
  
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
  
  const handlePhoneChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (simple validation)
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsPhoneChanging(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success("Phone number updated successfully");
      setIsPhoneChanging(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10">
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-thaali-green/20 flex items-center justify-center">
              <User className="h-10 w-10 text-thaali-green" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ITS ID:</span>
              <span className="font-medium">{user.itsId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thaali Type:</span>
              <Badge className="bg-thaali-green text-white">{user.thaaliType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10">
          <CardTitle className="text-lg">Update Phone Number</CardTitle>
        </CardHeader>
        <form onSubmit={handlePhoneChange}>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="thaali-input"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-thaali-green hover:bg-thaali-green-dark"
              disabled={isPhoneChanging}
            >
              {isPhoneChanging ? "Updating..." : "Update Phone Number"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10">
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>
            Enter your current password and a new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="thaali-input pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="thaali-input pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="thaali-input"
                required
              />
            </div>
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
    </div>
  );
};

export default UserProfile;
