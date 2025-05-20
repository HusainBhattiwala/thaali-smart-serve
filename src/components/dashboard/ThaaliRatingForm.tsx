
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Dish {
  name: string;
  rating: number;
  comment: string;
}

const ThaaliRatingForm = () => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [overallComment, setOverallComment] = useState<string>("");
  const [dishes, setDishes] = useState<Dish[]>([{ name: "", rating: 0, comment: "" }]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>("");

  // Function to handle overall rating change
  const handleOverallRatingChange = (rating: number) => {
    setOverallRating(rating);
  };

  // Function to handle dish rating change
  const handleDishRatingChange = (index: number, rating: number) => {
    const updatedDishes = [...dishes];
    updatedDishes[index].rating = rating;
    setDishes(updatedDishes);
  };

  // Function to handle dish comment change
  const handleDishCommentChange = (index: number, comment: string) => {
    const updatedDishes = [...dishes];
    updatedDishes[index].comment = comment;
    setDishes(updatedDishes);
  };

  // Function to handle dish name change
  const handleDishNameChange = (index: number, name: string) => {
    const updatedDishes = [...dishes];
    updatedDishes[index].name = name;
    setDishes(updatedDishes);
  };

  // Function to add a new dish
  const handleAddDish = () => {
    if (!newDishName.trim()) {
      toast.error("Please enter a dish name");
      return;
    }
    
    // Check if dish name already exists
    if (dishes.some(dish => dish.name.toLowerCase() === newDishName.toLowerCase())) {
      toast.error("This dish is already added");
      return;
    }
    
    setDishes([...dishes, { name: newDishName, rating: 0, comment: "" }]);
    setNewDishName("");
  };

  // Function to remove a dish
  const handleRemoveDish = (index: number) => {
    const updatedDishes = [...dishes];
    updatedDishes.splice(index, 1);
    setDishes(updatedDishes);
  };

  // Function to render stars for rating
  const renderStars = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-all ${
              star <= currentRating ? "fill-thaali-gold text-thaali-gold" : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  // Function to submit feedback
  const handleSubmit = async () => {
    // Validate overall rating
    if (overallRating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    // Filter out empty dishes
    const validDishes = dishes.filter(dish => dish.name.trim() && dish.rating > 0);
    
    if (validDishes.length === 0) {
      toast.error("Please add at least one dish with a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Today's date in YYYY-MM-DD format
      const today = format(new Date(), "yyyy-MM-dd");

      // Check if user already submitted feedback for today
      const { data: existingFeedback, error: checkError } = await supabase
        .from("thaali_feedback")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      let feedbackId;

      if (existingFeedback) {
        // Update existing feedback
        feedbackId = existingFeedback.id;
        
        const { error: updateError } = await supabase
          .from("thaali_feedback")
          .update({
            rating: overallRating,
            description: overallComment,
            updated_at: new Date().toISOString()
          })
          .eq("id", feedbackId);
        
        if (updateError) throw updateError;
        
        // Delete existing dish feedback
        const { error: deleteError } = await supabase
          .from("dish_feedback")
          .delete()
          .eq("thaali_feedback_id", feedbackId);
        
        if (deleteError) throw deleteError;
        
      } else {
        // Insert new feedback
        const { data: newFeedback, error: insertError } = await supabase
          .from("thaali_feedback")
          .insert({
            user_id: user.id,
            date: today,
            rating: overallRating,
            description: overallComment
          })
          .select("id")
          .single();
        
        if (insertError) throw insertError;
        if (!newFeedback) throw new Error("Failed to create feedback");
        
        feedbackId = newFeedback.id;
      }

      // Insert dish feedback
      const dishFeedback = validDishes.map(dish => ({
        thaali_feedback_id: feedbackId,
        dish_name: dish.name,
        rating: dish.rating,
        comment: dish.comment
      }));

      const { error: dishInsertError } = await supabase
        .from("dish_feedback")
        .insert(dishFeedback);
      
      if (dishInsertError) throw dishInsertError;

      toast.success("Your feedback has been submitted successfully!");
      
      // Reset form
      setOverallRating(0);
      setOverallComment("");
      setDishes([{ name: "", rating: 0, comment: "" }]);
      
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(`Failed to submit feedback: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="thaali-card">
      <CardHeader className="bg-thaali-green/10">
        <CardTitle className="text-lg">Rate Today's Thaali</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Overall Rating */}
        <div className="space-y-3">
          <Label>Overall Rating</Label>
          <div className="flex justify-center my-2">
            {renderStars(overallRating, handleOverallRatingChange)}
          </div>
          <Textarea
            placeholder="Share your overall experience with today's thaali..."
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            className="resize-none"
          />
        </div>

        {/* Dish-by-dish Rating */}
        <div className="space-y-4">
          <Label>Dish-by-dish Rating</Label>
          
          {/* Add New Dish */}
          <div className="flex gap-2">
            <Input
              placeholder="Add dish name..."
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              className="thaali-input"
            />
            <Button 
              onClick={handleAddDish} 
              variant="outline"
              className="whitespace-nowrap"
            >
              Add Dish
            </Button>
          </div>

          {/* Individual Dish Ratings */}
          {dishes.map((dish, index) => (
            <Card key={index} className="p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex-1">
                  {index === 0 ? (
                    <Input
                      placeholder="Enter dish name"
                      value={dish.name}
                      onChange={(e) => handleDishNameChange(index, e.target.value)}
                      className="thaali-input"
                    />
                  ) : (
                    <h4 className="font-medium">{dish.name}</h4>
                  )}
                </div>
                
                {dishes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveDish(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex justify-center my-2">
                {renderStars(dish.rating, (rating) => handleDishRatingChange(index, rating))}
              </div>
              
              <Textarea
                placeholder={`Comments about ${dish.name || 'this dish'}...`}
                value={dish.comment}
                onChange={(e) => handleDishCommentChange(index, e.target.comment = e.target.value)}
                className="resize-none mt-2"
              />
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-thaali-green hover:bg-thaali-green-dark"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThaaliRatingForm;
