
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {post.category}
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{post.date}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/blog/${post.id}`} className="flex items-center">
            Read more <ArrowRight size={14} className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
