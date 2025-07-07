import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You for Joining!</h1>
          <p className="text-muted-foreground mb-8">
            We're excited to have you on our waitlist. We'll keep you updated on our progress.
          </p>
          <Button onClick={() => setLocation("/")} variant="outline">
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
