
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import FeedbackDetail from "@/components/admin/FeedbackDetail";
import { supabase } from "@/lib/supabase";

// Sample data for demonstration while building UI
const SAMPLE_FEEDBACK = [
  {
    id: "1",
    user_id: "123",
    userName: "Ahmed Ali",
    date: format(new Date(), "yyyy-MM-dd"),
    rating: 4,
    description: "Overall good food, especially enjoyed the dal.",
    created_at: "2023-05-14 13:24:11",
    dishes: [
      { dish_name: "Rice", rating: 5, comment: "Perfect consistency" },
      { dish_name: "Dal", rating: 5, comment: "Very flavorful" },
      { dish_name: "Roti", rating: 3, comment: "A bit hard" },
    ]
  },
  {
    id: "2",
    user_id: "456",
    userName: "Fatima Hussain",
    date: format(new Date(), "yyyy-MM-dd"),
    rating: 3,
    description: "The food was ok today, but the roti was cold.",
    created_at: "2023-05-14 14:17:22",
    dishes: [
      { dish_name: "Rice", rating: 4, comment: "Good" },
      { dish_name: "Curry", rating: 3, comment: "A bit too spicy" },
      { dish_name: "Roti", rating: 2, comment: "Cold by delivery time" },
    ]
  }
];

const FeedbackReportPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchFeedback();
  }, [date]);

  const fetchFeedback = async () => {
    if (!date) return;
    
    setIsLoading(true);
    try {
      // Format date for the query
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Fetch feedback for the selected date
      const { data: thaaliData, error: thaaliError } = await supabase
        .from("thaali_feedback")
        .select("*, profiles:user_id(name)")
        .eq("date", formattedDate);
      
      if (thaaliError) throw thaaliError;
      
      // For each thaali feedback, fetch the related dish feedback
      const feedbackWithDishes = await Promise.all(
        (thaaliData || []).map(async (feedback) => {
          const { data: dishData, error: dishError } = await supabase
            .from("dish_feedback")
            .select("*")
            .eq("thaali_feedback_id", feedback.id);
          
          if (dishError) throw dishError;
          
          return {
            ...feedback,
            userName: feedback.profiles?.name || "Unknown User",
            dishes: dishData || []
          };
        })
      );
      
      setFeedbackList(feedbackWithDishes);
      
      // If there's feedback and none is selected, select the first one
      if (feedbackWithDishes.length > 0 && !selectedFeedback) {
        setSelectedFeedback(feedbackWithDishes[0]);
      }
    } catch (error: any) {
      console.error("Error fetching feedback:", error.message);
      toast.error("Failed to fetch feedback");
      
      // For demo purposes, use sample data when there's an error or during development
      setFeedbackList(SAMPLE_FEEDBACK);
      if (SAMPLE_FEEDBACK.length > 0 && !selectedFeedback) {
        setSelectedFeedback(SAMPLE_FEEDBACK[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedFeedback(null);
  };

  const handleDownload = () => {
    // In a real app, this would generate and download an Excel file
    toast.success("Feedback report downloaded successfully");
  };

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const filteredFeedback = tab === "all" 
    ? feedbackList 
    : tab === "positive" 
      ? feedbackList.filter(f => f.rating >= 4)
      : feedbackList.filter(f => f.rating <= 2);

  const getAverageRating = () => {
    if (feedbackList.length === 0) return 0;
    const sum = feedbackList.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / feedbackList.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Thaali Feedback Report</h1>
      
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Feedback for {date ? format(date, "PPP") : "Today"}</CardTitle>
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
          <div className="p-4 bg-thaali-green/5 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Feedback</div>
              <div className="text-2xl font-bold text-thaali-green">{feedbackList.length}</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-sm text-muted-foreground">Average Rating</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-thaali-green mr-1">{getAverageRating()}</div>
                <Star className="h-5 w-5 fill-thaali-gold text-thaali-gold" />
              </div>
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
          
          <div className="border-t">
            <Tabs defaultValue="all" value={tab} onValueChange={handleTabChange} className="w-full">
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Feedback</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="negative">Critical</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={tab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="border-r md:col-span-1 max-h-[600px] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-8 text-center text-muted-foreground">Loading feedback...</div>
                    ) : filteredFeedback.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">No feedback found for this date</div>
                    ) : (
                      filteredFeedback.map((feedback) => (
                        <div
                          key={feedback.id}
                          className={cn(
                            "border-b p-4 cursor-pointer hover:bg-thaali-green/5 transition-colors",
                            selectedFeedback?.id === feedback.id ? "bg-thaali-green/10" : ""
                          )}
                          onClick={() => setSelectedFeedback(feedback)}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{feedback.userName}</h3>
                            <div className="flex items-center gap-1">
                              <span>{feedback.rating}</span>
                              <Star className={cn(
                                "h-4 w-4",
                                feedback.rating >= 4 ? "fill-thaali-gold text-thaali-gold" : 
                                feedback.rating <= 2 ? "fill-red-400 text-red-400" : 
                                "fill-amber-400 text-amber-400"
                              )} />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {feedback.description || "No description provided"}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex gap-1">
                              {feedback.dishes.map((dish: any, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {dish.dish_name}
                                </Badge>
                              )).slice(0, 3)}
                              {feedback.dishes.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{feedback.dishes.length - 3}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(feedback.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="md:col-span-2 p-6">
                    {selectedFeedback ? (
                      <FeedbackDetail feedback={selectedFeedback} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select feedback to view details
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackReportPage;
