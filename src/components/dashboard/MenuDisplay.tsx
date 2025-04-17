
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";

// Sample menu data for the demo
const SAMPLE_MENU = {
  today: {
    date: new Date().toLocaleDateString(),
    items: ["Biryani", "Raita", "Salad", "Mithai", "Fruit"]
  },
  week: [
    {
      date: new Date().toLocaleDateString(),
      day: "Today",
      items: ["Biryani", "Raita", "Salad", "Mithai", "Fruit"]
    },
    {
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
      day: "Tomorrow",
      items: ["Dal Chawal", "Kadhi", "Papad", "Pickle", "Salad"]
    },
    {
      date: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
      day: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { weekday: 'long' }),
      items: ["Khichdi", "Kadhi", "Papad", "Pickle", "Kheer"]
    },
    {
      date: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
      day: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { weekday: 'long' }),
      items: ["Pulao", "Korma", "Naan", "Salad", "Jalebi"]
    },
    {
      date: new Date(Date.now() + 86400000 * 4).toLocaleDateString(),
      day: new Date(Date.now() + 86400000 * 4).toLocaleDateString('en-US', { weekday: 'long' }),
      items: ["Masala Khichdi", "Shahi Paneer", "Roti", "Raita", "Gulab Jamun"]
    }
  ]
};

const MenuDisplay = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <Card className="thaali-card animate-fade-in">
      <CardHeader className="bg-thaali-green/10 pb-2">
        <CardTitle className="text-lg">Menu</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
              <TabsTrigger value="week" className="flex-1">This Week</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="today" className="mt-0 p-4">
            <div className="text-center mb-3">
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{SAMPLE_MENU.today.date}</span>
              </div>
            </div>
            <ul className="space-y-2">
              {SAMPLE_MENU.today.items.map((item, i) => (
                <li key={i} className="flex items-center pb-2 border-b border-thaali-green/10">
                  <span className="w-6 h-6 rounded-full bg-thaali-green/20 flex items-center justify-center text-xs mr-3">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <div className="divide-y divide-thaali-green/10">
              {SAMPLE_MENU.week.map((day, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-sm text-muted-foreground">{day.date}</span>
                  </div>
                  <ul className="text-sm">
                    {day.items.map((item, idx) => (
                      <li key={idx} className="inline-block mr-2 mb-1">
                        <span className="bg-thaali-green/10 px-2 py-1 rounded-md">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MenuDisplay;
