
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";

interface PhoneUpdateFormProps {
  initialPhone: string;
}

const PhoneUpdateForm = ({ initialPhone }: PhoneUpdateFormProps) => {
  const [phone, setPhone] = useState(initialPhone || "");
  const [isPhoneChanging, setIsPhoneChanging] = useState(false);
  
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
  );
};

export default PhoneUpdateForm;
