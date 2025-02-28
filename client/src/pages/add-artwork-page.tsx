
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";

export default function AddArtworkPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const addArtworkMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          videoUrl: videoUrl || null,
          isPremium,
        }),
      });
      if (!res.ok) throw new Error("Failed to add artwork");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks"] });
      toast({
        title: "Success",
        description: "Artwork added successfully",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Artwork</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            addArtworkMutation.mutate();
          }} className="space-y-4">
            <div>
              <label className="block mb-2">Title</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Image URL</label>
              <Input
                required
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Video URL (Optional)</label>
              <Input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label>Premium Content</label>
            </div>
            <Button 
              type="submit"
              disabled={addArtworkMutation.isPending}
              className="w-full"
            >
              Add Artwork
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
