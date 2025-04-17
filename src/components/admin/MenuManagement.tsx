
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CalendarIcon, PlusCircle, Save, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample data for demonstration
const SAMPLE_MENUS = [
  {
    date: format(new Date(), "yyyy-MM-dd"),
    items: "Biryani, Raita, Salad, Mithai, Fruit"
  },
  {
    date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
    items: "Dal Chawal, Kadhi, Papad, Pickle, Salad"
  },
  {
    date: format(new Date(Date.now() + 86400000 * 2), "yyyy-MM-dd"),
    items: "Khichdi, Kadhi, Papad, Pickle, Kheer"
  }
];

const MenuManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [menuItems, setMenuItems] = useState("");
  const [menus, setMenus] = useState(SAMPLE_MENUS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!menuItems.trim()) {
      toast.error("Please enter menu items");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Check if the date already exists
      const existingIndex = menus.findIndex(menu => menu.date === formattedDate);
      
      if (existingIndex !== -1) {
        // Update existing menu
        const updatedMenus = [...menus];
        updatedMenus[existingIndex] = { date: formattedDate, items: menuItems };
        setMenus(updatedMenus);
        toast.success("Menu updated successfully");
      } else {
        // Add new menu
        setMenus([...menus, { date: formattedDate, items: menuItems }]);
        toast.success("Menu added successfully");
      }
      
      setMenuItems("");
      setDate(new Date());
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleBulkUpload = () => {
    // In a real app, this would open a file upload dialog
    toast.info("Bulk upload feature would be implemented here");
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10">
          <CardTitle className="text-lg">Add/Edit Menu</CardTitle>
          <CardDescription>
            Create a new menu or update an existing one
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
              <Label htmlFor="menuItems">Menu Items</Label>
              <Textarea
                id="menuItems"
                placeholder="Enter menu items separated by commas (e.g., Biryani, Raita, Salad)"
                value={menuItems}
                onChange={(e) => setMenuItems(e.target.value)}
                className="thaali-input min-h-24"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2 flex-col sm:flex-row">
            <Button 
              type="submit" 
              className="bg-thaali-green hover:bg-thaali-green-dark w-full sm:w-auto flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Menu"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="border-thaali-gold text-thaali-gold hover:bg-thaali-gold/10 hover:text-thaali-gold-dark w-full sm:w-auto flex items-center gap-1"
              onClick={handleBulkUpload}
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10">
          <CardTitle className="text-lg">Upcoming Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Menu Items</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((menu, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(menu.date), "PPP")}
                    </TableCell>
                    <TableCell>{menu.items}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-thaali-green hover:text-thaali-green-dark hover:bg-thaali-green/10"
                        onClick={() => {
                          setDate(new Date(menu.date));
                          setMenuItems(menu.items);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;
