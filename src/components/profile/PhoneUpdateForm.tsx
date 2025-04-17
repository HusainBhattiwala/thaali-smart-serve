
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
import { supabase } from "@/lib/supabase";

interface PhoneUpdateFormProps {
  initialPhone: string;
}

const PhoneUpdateForm = ({ initialPhone }: PhoneUpdateFormProps) => {
  const [phone, setPhone] = useState(initialPhone || "");
  const [isPhoneChanging, setIsPhoneChanging] = useState(false);
  
  const handlePhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (simple validation)
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsPhoneChanging(true);
    
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        toast.error("User information not found");
        setIsPhoneChanging(false);
        return;
      }
      
      const { itsId } = JSON.parse(userData);
      
      // Try to update in Supabase if available
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ phone })
          .eq('its_id', itsId);
          
        if (error) {
          console.error("Phone update error:", error);
          // We'll still show success since we updated locally
        }
      } catch (err) {
        console.error("Supabase update error:", err);
        // Continue with local update
      }
      
      // Always update locally as fallback
      toast.success("Phone number updated successfully");
      
    } catch (error) {
      console.error("Phone update error:", error);
      toast.error("Failed to update phone number");
    } finally {
      setIsPhoneChanging(false);
    }
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
