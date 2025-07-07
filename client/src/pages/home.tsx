import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Turnstile from "react-turnstile";
import { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { FullWidthImage } from "@/components/ui/full-width-image";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

// Performance optimization: lazy-loaded components
const TeamSection = lazy(() => import("@/components/TeamSection"));

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Include the Turnstile token in the request
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          token
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },
    onSuccess: () => {
      setLocation("/success");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Memoize the form submission handler for better performance
  const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  }, [mutation]);

  return (
    <div className="min-h-screen">
      {/* Full-width hero image */}
      <div className="relative">
        <FullWidthImage 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Modern office space"
          aspectRatio={21/9}
          overlay={true}
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Exclusive Waitlist
            </h1>
            <p className="text-xl mb-8">
              Be among the first to experience our revolutionary platform
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Join Us?</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                ✓ Early access to innovative features
              </p>
              <p className="text-muted-foreground">
                ✓ Exclusive launch benefits
              </p>
              <p className="text-muted-foreground">
                ✓ Direct feedback channel to our team
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mb-4">
                    <Turnstile
                      sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                      onVerify={(token: string) => setToken(token)}
                      refreshExpired="auto"
                      className="flex justify-center"
                      theme="light"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={mutation.isPending || !token}
                  >
                    {mutation.isPending ? "Joining..." : "Join Waitlist"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />
        
        {/* Lazy-loaded team section for better performance */}
        <Suspense fallback={<div className="text-center py-12">Loading team information...</div>}>
          <TeamSection />
        </Suspense>
      </div>

      {/* Second full-width image section */}
      <div className="relative mt-16">
        <FullWidthImage 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Team collaboration"
          aspectRatio={21/9}
          overlay={true}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg mb-6">Join thousands of satisfied customers who have taken their business to the next level.</p>
            <Button size="lg" variant="default" className="font-semibold" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Join Waitlist Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}