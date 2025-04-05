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

export function AboutDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#222] border-gray-800">
        <DialogHeader className="text-left">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">About Us</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-gray-400">
            Learn more about Anime Kingdom
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-gray-300">
          <h3 className="text-xl font-semibold text-white">Our Mission</h3>
          <p>
            Anime Kingdom was created with a simple mission: to provide anime enthusiasts with a reliable, 
            user-friendly platform to discover, watch, and discuss their favorite anime series and movies.
          </p>
          
          <h3 className="text-xl font-semibold text-white">Who We Are</h3>
          <p>
            We are a team of passionate anime fans who wanted to create the ultimate destination for 
            anime content. Our team works tirelessly to ensure that our platform offers the latest and 
            greatest anime titles, with high-quality streaming options and a seamless user experience.
          </p>
          
          <h3 className="text-xl font-semibold text-white">Our Values</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-semibold">Quality:</span> We strive to provide the highest quality anime content possible.</li>
            <li><span className="font-semibold">Community:</span> We believe in fostering a welcoming and inclusive community of anime fans.</li>
            <li><span className="font-semibold">Accessibility:</span> We are committed to making anime accessible to everyone, regardless of their background or experience with anime.</li>
            <li><span className="font-semibold">Innovation:</span> We continuously work to improve our platform and offer new features that enhance the user experience.</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-white">Join Our Community</h3>
          <p>
            Anime Kingdom is more than just a streaming platform – it's a community. We encourage you to 
            join our Discord server, follow us on social media, and engage with other anime fans to share 
            your thoughts, recommendations, and experiences.
          </p>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Thank you for being part of our journey. Together, let's celebrate the amazing world of anime!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}