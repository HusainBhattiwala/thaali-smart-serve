import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Download, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample data for demonstration
const SAMPLE_REQUESTS = [
  {
    itsId: "12345678",
    name: "Ahmed Ali",
    thaaliType: "Medium",
    requestType: "none",
    date: format(new Date(), "yyyy-MM-dd"),
    reason: "Out of town",
    timestamp: "2023-04-16 18:32:45"
  },
  {
    itsId: "23456789",
    name: "Fatima Hussain",
    thaaliType: "Small",
    requestType: "half",
    date: format(new Date(), "yyyy-MM-dd"),
    reason: "Fasting",
    timestamp: "2023-04-16 19:15:22"
  },
  {
    itsId: "34567890",
    name: "Mohammed Khan",
    thaaliType: "Large",
    requestType: "extra",
    date: format(new Date(), "yyyy-MM-dd"),
    reason: "Guests expected",
    timestamp: "2023-04-16 20:05:11"
  },
  {
    itsId: "45678901",
    name: "Aisha Qadir",
    thaaliType: "Medium",
    requestType: "none",
    date: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    timestamp: "2023-04-16 21:22:37"
  }
];

const ThaaliChangeReport = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [requests, setRequests] = useState(SAMPLE_REQUESTS);
  
  // Calculate summary
  const noneThaali = requests.filter(req => req.requestType === "none").length;
  const halfThaali = requests.filter(req => req.requestType === "half").length;
  const extraThaali = requests.filter(req => req.requestType === "extra").length;
  
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    // In a real app, this would fetch data for the selected date
    toast.info(`Fetching requests for ${selectedDate ? format(selectedDate, "PPP") : "today"}`);
    
    // For demo purposes, we'll just keep the same data
  };
  
  const handleDownload = () => {
    // In a real app, this would generate and download an Excel file
    toast.success("Report downloaded successfully");
  };
  
  const formatRequestType = (type: string) => {
    switch (type) {
      case "none": return "No Thaali";
      case "half": return "Half Thaali";
      case "extra": return "Extra Thaali";
      default: return type;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Thaali Change Report</CardTitle>
              <CardDescription>
                View and manage change requests
              </CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 bg-thaali-green/5 flex flex-wrap gap-4 justify-between">
            <div>
              <div className="text-sm text-muted-foreground">No Thaali</div>
              <div className="text-2xl font-bold text-thaali-green">{noneThaali}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Half Thaali</div>
              <div className="text-2xl font-bold text-thaali-green">{halfThaali}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Extra Thaali</div>
              <div className="text-2xl font-bold text-thaali-green">{extraThaali}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
              <div className="text-2xl font-bold text-thaali-green">{requests.length}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 border-thaali-gold text-thaali-gold hover:bg-thaali-gold/10 hover:text-thaali-gold-dark flex items-center gap-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ITS ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Thaali Type</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Submission Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.itsId}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.thaaliType}</TableCell>
                    <TableCell>
                      <span 
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          request.requestType === "none" 
                            ? "bg-red-100 text-red-800" 
                            : request.requestType === "half" 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-green-100 text-green-800"
                        )}
                      >
                        {formatRequestType(request.requestType)}
                      </span>
                    </TableCell>
                    <TableCell>{request.reason || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThaaliChangeReport;
