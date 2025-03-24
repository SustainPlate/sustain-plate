
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BlogList from '@/components/blog/BlogList';
import { BlogPost } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';

// Sample blog posts data
const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "Local Restaurant Chain Partners with SustainPlate to Reduce Food Waste",
    excerpt: "A major restaurant chain in the city has partnered with SustainPlate to donate excess food to local shelters, helping to reduce food waste while supporting those in need.",
    date: "June 2, 2023",
    author: "Emma Johnson",
    category: "Partnerships",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  },
  {
    id: "2",
    title: "SustainPlate's Volunteer Network Expands to Neighboring Counties",
    excerpt: "Our dedicated volunteer network is expanding to neighboring counties, allowing us to rescue more food and serve more communities in need.",
    date: "May 15, 2023",
    author: "Marcus Chen",
    category: "Volunteers",
    imageUrl: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "3",
    title: "Food Waste Reduction: Tips for Restaurants and Cafes",
    excerpt: "Discover practical tips for restaurants and cafes to reduce food waste, save money, and contribute to a more sustainable food system.",
    date: "April 28, 2023",
    author: "Sophia Williams",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1488992783499-418eb1f62d08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
  },
  {
    id: "4",
    title: "Local School District Implements Food Recovery Program",
    excerpt: "A local school district has partnered with SustainPlate to implement a food recovery program in cafeterias, teaching students about food waste and sustainability.",
    date: "April 12, 2023",
    author: "David Rodriguez",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1544628856-3f48f1aa0610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "5",
    title: "SustainPlate Reaches Milestone: 50,000 Meals Rescued",
    excerpt: "We're proud to announce that SustainPlate has reached a significant milestone, rescuing over 50,000 meals from going to waste in just one year of operation.",
    date: "March 20, 2023",
    author: "Emma Johnson",
    category: "Milestones",
    imageUrl: "https://images.unsplash.com/photo-1571942676516-bcab84649e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "6",
    title: "Tech Innovation: New App Features for Better Food Matching",
    excerpt: "SustainPlate has released new app features designed to improve the matching of food donations with recipient organizations based on specific needs and preferences.",
    date: "February 28, 2023",
    author: "Jamal Washington",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <section className="bg-green-50 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Blog & News</h1>
              <p className="text-lg text-gray-600 mb-8">
                Stay updated with the latest news, success stories, and insights about food rescue initiatives at SustainPlate.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Latest Articles</h2>
                <div className="flex gap-2">
                  <Button variant="outline">All</Button>
                  <Button variant="outline">Partnerships</Button>
                  <Button variant="outline">Education</Button>
                  <Button variant="outline">Technology</Button>
                </div>
              </div>
              <BlogList posts={samplePosts} />
            </div>
            
            <div className="text-center mt-12">
              <Button>Load More Articles</Button>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-6">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-8">
                Get the latest updates on food rescue initiatives, success stories, and tips delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
