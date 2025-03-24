
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, ArrowLeft, Share } from 'lucide-react';
import { BlogPost } from '@/components/blog/BlogCard';

// Sample blog posts data (same as in Blog.tsx)
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

// Sample full blog post content
const fullContent = `
<p>A major restaurant chain in the city has partnered with SustainPlate to donate excess food to local shelters, helping to reduce food waste while supporting those in need.</p>

<p>The partnership, which began last month, has already resulted in over 500 meals being redistributed to three local shelters that serve homeless and vulnerable populations.</p>

<h2>How It Works</h2>

<p>"At the end of each day, our staff packages up unsold but perfectly good food items according to SustainPlate's guidelines," explains Maria Rodriguez, the restaurant chain's sustainability director. "The SustainPlate app matches our donation with nearby shelters, and their volunteer network handles pickup and delivery."</p>

<p>This system ensures that food that would otherwise be thrown away is instead going to people who need it, while also reducing the environmental impact of food waste.</p>

<h2>Benefits Beyond Food Donation</h2>

<p>The restaurant chain reports several unexpected benefits from the partnership:</p>

<ul>
  <li>Staff morale has improved, with employees expressing satisfaction that leftover food is being put to good use</li>
  <li>The company has reduced waste disposal costs</li>
  <li>The partnership has enhanced the restaurant's reputation in the community</li>
</ul>

<p>"We initially joined this program for environmental and social responsibility reasons," Rodriguez says, "but we've found that it also makes good business sense."</p>

<h2>Next Steps</h2>

<p>Based on the success of the initial partnership, the restaurant chain plans to expand the program to all 15 of its locations across the metropolitan area by the end of the year.</p>

<p>SustainPlate is actively recruiting more volunteers to handle the increased food distribution that will result from this expansion.</p>

<p>"This partnership demonstrates the win-win potential of food rescue programs," says SustainPlate founder Marcus Chen. "Restaurants reduce waste and costs, vulnerable people get nutritious meals, and less food ends up in landfills producing methane."</p>

<p>If your restaurant or food business is interested in joining SustainPlate's network of food donors, you can learn more and sign up through our website or mobile app.</p>
`;

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = samplePosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-24 pb-16 container mx-auto px-6">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold mb-4">Blog Post Not Found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <article className="container mx-auto px-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/blog" className="flex items-center">
                <ArrowLeft size={16} className="mr-2" /> Back to all articles
              </Link>
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Tag size={16} className="mr-1" />
                <span>{post.category}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-green lg:prose-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Share this article</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share size={14} className="mr-1" /> Share
                    </Button>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/blog">Back to Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostDetail;
