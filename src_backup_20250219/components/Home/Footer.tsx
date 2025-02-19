import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Twitter, Facebook, Linkedin } from 'lucide-react';
import Image from "next/image";

const Footer = () => {
  return (
      <Card className="bg-teal-900 text-white rounded-none border-none shadow-none">
        <CardContent className="p-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8">
                    <Image
                        src="/Images/PharmacyHub.png" // Replace with your image path
                        alt="Pills"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                  </div>
                  <span className="text-xl font-bold">Pharmacy Hub</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Lorem ipsum dolor amet, consectetur adipiscing esed dia nonumy eirmod tempor invidunt.
                </p>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="hover:text-cyan-400 hover:bg-transparent">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:text-cyan-400 hover:bg-transparent">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:text-cyan-400 hover:bg-transparent">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Us</h3>
                <div className="space-y-3">
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal space-x-2">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm">482 Charter Street</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal space-x-2">
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm">0 (800) 123 4567</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal space-x-2">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm">pharmacom@example.com</span>
                  </Button>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Our services</h3>
                <div className="space-y-2">
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal block text-sm">
                    Research & Preclinical
                  </Button>
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal block text-sm">
                    Starting, Medium, Finishing Phase
                  </Button>
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal block text-sm">
                    After Drug Approval
                  </Button>
                  <Button variant="link" className="text-white hover:text-cyan-400 p-0 h-auto font-normal block text-sm">
                    Drugs Production
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-gray-700" />

            <div className="text-center md:text-left text-sm text-gray-400">
              © Pharmacy Hub 2024 | Created with by SeroftSolutioin
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default Footer;