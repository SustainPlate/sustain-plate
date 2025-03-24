
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Sustain Plate, our donation process, and how you can get involved.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">How does Sustain Plate work?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Sustain Plate connects food donors (restaurants, supermarkets, etc.) with NGOs that distribute food to those in need. 
                  Volunteers help with the logistics by transporting donations. Our platform uses an intelligent matching system to connect 
                  surplus food with the right organizations based on location, food type, and timing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">Who can donate food?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Any food business can donate, including restaurants, cafes, grocery stores, bakeries, catering companies, and corporate cafeterias. 
                  We also welcome individual donations for special events. All donors must comply with local food safety regulations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">What types of food can be donated?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  We accept a wide variety of food items including prepared meals, fresh produce, baked goods, canned goods, and packaged foods. 
                  All donated food must be unexpired, stored at proper temperatures, and in good condition. We cannot accept food that has been 
                  previously served or left at room temperature for extended periods.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">How do I become a volunteer?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  To become a volunteer, create an account on Sustain Plate and navigate to the "Become a Volunteer" section. 
                  You'll need to provide some basic information about your availability and transportation capabilities. Once registered, 
                  you'll be able to see available delivery opportunities in your area.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">How are NGOs verified?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  NGOs must register with valid credentials and documentation proving their status as a non-profit organization. 
                  Our team verifies this information before approving their account. We also conduct periodic reviews to ensure 
                  all organizations on our platform are legitimately serving those in need.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">Is there a cost to use Sustain Plate?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Sustain Plate is completely free for all users - donors, NGOs, and volunteers. Our mission is to reduce food waste 
                  and hunger without financial barriers. We sustain our operations through grants, corporate partnerships, and donations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">How do you ensure food safety?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  We have strict guidelines for food handling and transportation. All donated food must meet safety standards, and we provide 
                  training resources for our volunteers on proper food handling. We track temperature requirements and expiration dates for all 
                  donations to ensure only safe food reaches those in need.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium px-4">Can I track the impact of my donations?</AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Yes! Donors have access to a dashboard that shows statistics about their contributions - including the number of meals 
                  provided, amount of food rescued from waste, and the organizations that received their donations. We believe in transparency 
                  and want you to see the difference you're making.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Contact our support team and we'll get back to you as soon as possible.</p>
            <a 
              href="mailto:support@sustainplate.com" 
              className="bg-sustain-500 text-white px-6 py-3 rounded-md hover:bg-sustain-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
