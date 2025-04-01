
import React from 'react';
import { Building2, Users, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const UserTypes: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Who Can Use SustainPlate?</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is designed to connect different stakeholders in food waste reduction.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-primary" />
                <CardTitle>Donors</CardTitle>
              </div>
              <CardDescription>
                Restaurants, hotels, schools, and individuals with excess food to share.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Create food donation listings</li>
                <li>Connect with local NGOs and volunteers</li>
                <li>Track your impact in reducing food waste</li>
                <li>Receive tax benefits for donations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/auth?tab=signup&userType=donor">Register as Donor</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle>NGOs</CardTitle>
              </div>
              <CardDescription>
                Non-profit organizations focused on food collection and distribution.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Find available food donations nearby</li>
                <li>Reserve and collect food items</li>
                <li>Manage donation pickup schedules</li>
                <li>Track impact and distribution metrics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/auth?tab=signup&userType=ngo">Register as NGO</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Volunteers</CardTitle>
              </div>
              <CardDescription>
                Individuals willing to help with food pickup and delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Find volunteer opportunities near you</li>
                <li>Help transport food from donors to NGOs</li>
                <li>Set your availability and preferred radius</li>
                <li>Track your contribution to your community</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/auth?tab=signup&userType=volunteer">Register as Volunteer</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
