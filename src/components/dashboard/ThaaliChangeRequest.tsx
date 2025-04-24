import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type RequestType = "none" | "half" | "extra";

const ThaaliChangeRequest = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [requestType, setRequestType] = useState<RequestType>("none");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("User not found");
      return;
    }
    
    if (!date) {
      toast.error("Please select a date for your request");
      return;
    }
    
    // Check if date is in the past
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      toast.error("Cannot make requests for past dates");
      return;
    }
    
    // Check if it's past the cutoff time (10 PM previous day)
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const cutoffTime = new Date();
    cutoffTime.setHours(22, 0, 0, 0); // 10 PM today
    
    if (date.getTime() === tomorrow.getTime() && now > cutoffTime) {
      toast.error("Cutoff time (10 PM) has passed for tomorrow's request");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('thaali_requests')
        .insert({
          user_id: user.id,
          request_date: date.toISOString(),
          current_type: user.thaaliType,
          requested_type: requestType === 'none' ? 'No Thaali' 
            : requestType === 'half' ? 'Half Thaali' 
            : 'Extra Thaali',
          status: 'pending',
          reason: reason || null
        });

      if (error) throw error;
      
      toast.success("Your Thaali change request has been submitted successfully");
      
      // Reset form
      setDate(undefined);
      setRequestType("none");
      setReason("");
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="thaali-card animate-fade-in">
      <CardHeader className="bg-thaali-green/10">
        <CardTitle className="text-lg">Create Thaali Change Request</CardTitle>
        <CardDescription>
          Submit your request before 10 PM for the next day
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Request Type</Label>
            <RadioGroup 
              value={requestType} 
              onValueChange={(value) => setRequestType(value as RequestType)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="cursor-pointer">No Thaali Needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="half" id="half" />
                <Label htmlFor="half" className="cursor-pointer">Half Quantity Needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extra" id="extra" />
                <Label htmlFor="extra" className="cursor-pointer">Extra Food Needed</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for your request (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="thaali-input"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-thaali-green hover:bg-thaali-green-dark"
            disabled={isSubmitting || !date}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ThaaliChangeRequest;
