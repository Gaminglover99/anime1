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
import { X, Instagram, Youtube } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export function ContactDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#222] border-gray-800">
        <DialogHeader className="text-left">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">Contact Us</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-gray-400">
            Get in touch with the Anime Kingdom team
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="grid grid-cols-3 gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-all border border-gray-700"
              >
                <Instagram className="h-8 w-8 mb-2 text-pink-500" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-all border border-gray-700"
              >
                <Youtube className="h-8 w-8 mb-2 text-red-500" />
                <span className="text-sm font-medium">YouTube</span>
              </a>
              
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#333] transition-all border border-gray-700"
              >
                <SiDiscord className="h-8 w-8 mb-2 text-indigo-500" />
                <span className="text-sm font-medium">Discord</span>
              </a>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Email</h3>
            <p>
              For general inquiries: <a href="mailto:contact@animekingdom.com" className="text-[#ff3a3a] hover:underline">contact@animekingdom.com</a>
            </p>
            <p className="mt-2">
              For support issues: <a href="mailto:support@animekingdom.com" className="text-[#ff3a3a] hover:underline">support@animekingdom.com</a>
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              We typically respond to all inquiries within 24-48 hours. For faster assistance, 
              consider joining our Discord community where our team and community members can help.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}