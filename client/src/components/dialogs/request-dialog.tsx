import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const requestAnimeSchema = z.object({
  animeName: z.string().min(1, "Anime name is required"),
  animeYear: z.string().optional(),
  additionalInfo: z.string().optional(),
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
});

type RequestAnimeFormValues = z.infer<typeof requestAnimeSchema>;

export function RequestDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RequestAnimeFormValues>({
    resolver: zodResolver(requestAnimeSchema),
    defaultValues: {
      animeName: "",
      animeYear: "",
      additionalInfo: "",
      email: "",
    },
  });

  function onSubmit(data: RequestAnimeFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Request Submitted",
        description: `We've received your request for '${data.animeName}'. We'll review it soon!`,
      });
      
      form.reset();
      setIsSubmitting(false);
      
      // Close dialog automatically
      document.querySelector('[data-state="open"] button[aria-label="Close"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 1000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-[#222] border-gray-800">
        <DialogHeader className="text-left">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">Request Anime</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-gray-400">
            Can't find your favorite anime? Let us know and we'll add it!
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="animeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Anime Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter the anime name" 
                      {...field} 
                      className="bg-[#333] border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="animeYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Release Year</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 2022" 
                      {...field} 
                      className="bg-[#333] border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any details that might help us find the anime" 
                      {...field} 
                      className="bg-[#333] border-gray-700 text-white min-h-[100px]"
                    />
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
                  <FormLabel className="text-white">Your Email *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      className="bg-[#333] border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#ff3a3a] hover:bg-[#e62e2e] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
              <p className="mt-2 text-gray-400 text-xs text-center">
                We'll notify you once the requested anime is added to our platform.
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}