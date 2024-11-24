// app/community/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    image: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
}

async function getCommunityPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/posts`);
  return res.json();
}

export default async function CommunityPage() {
  const posts = await getCommunityPosts();

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Community</h1>
        <Button>Create Post</Button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-base">{post.author.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.content}</p>

              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-1 h-4 w-4" /> {post.comments}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}