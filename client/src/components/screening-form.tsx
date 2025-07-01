import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertScreeningRequestSchema, type InsertScreeningRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScreeningFormProps {
  screeningType: string;
  title: string;
}

export default function ScreeningForm({ screeningType, title }: ScreeningFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertScreeningRequest>({
    resolver: zodResolver(insertScreeningRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      screeningType,
      eventDate: "",
      attendeeCount: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertScreeningRequest) => {
      return apiRequest("POST", "/api/screening-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "We'll get back to you soon about your screening request.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/screening-requests"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    },
  });

  const onSubmit = (data: InsertScreeningRequest) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">
          Request {title} Screening
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Event Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Attendees</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 50-100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your event, audience, and any specific requirements..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 text-lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Screening Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
