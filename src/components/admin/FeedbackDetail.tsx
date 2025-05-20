
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Star, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface Dish {
  dish_name: string;
  rating: number;
  comment?: string;
}

interface Feedback {
  id: string;
  userName: string;
  date: string;
  rating: number;
  description?: string;
  created_at: string;
  dishes: Dish[];
}

interface FeedbackDetailProps {
  feedback: Feedback;
}

const FeedbackDetail = ({ feedback }: FeedbackDetailProps) => {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "fill-thaali-gold text-thaali-gold" : "text-gray-300"}`} 
      />
    ));
  };

  // Get formatted date and time from created_at timestamp
  const getFormattedDateTime = () => {
    try {
      const date = new Date(feedback.created_at);
      return {
        date: format(date, "PPP"),
        time: format(date, "p")
      };
    } catch (error) {
      return {
        date: "Unknown date",
        time: "Unknown time"
      };
    }
  };

  const { date: formattedDate, time: formattedTime } = getFormattedDateTime();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-thaali-green/20 flex items-center justify-center">
            <User className="h-6 w-6 text-thaali-green" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{feedback.userName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xl font-bold">{feedback.rating}/5</div>
          <div className="flex">{renderStars(feedback.rating)}</div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Overall Feedback</h4>
          <p className="text-muted-foreground">
            {feedback.description || "No overall feedback provided."}
          </p>
        </CardContent>
      </Card>

      <div>
        <h4 className="font-medium mb-3">Dish-by-dish Feedback</h4>
        {feedback.dishes.length === 0 ? (
          <p className="text-muted-foreground">No dish-specific feedback provided.</p>
        ) : (
          <div className="space-y-4">
            {feedback.dishes.map((dish, index) => (
              <Card key={index}>
                <CardContent className="py-3">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-medium">{dish.dish_name}</h5>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{dish.rating}</span>
                      <div className="flex">{renderStars(dish.rating)}</div>
                    </div>
                  </div>
                  {dish.comment && (
                    <>
                      <Separator className="my-2" />
                      <p className="text-sm text-muted-foreground">{dish.comment}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDetail;
