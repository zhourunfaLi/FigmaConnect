import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type Comment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { format } from "date-fns";

export default function CommentSection({ artworkId }: { artworkId: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");

  const { data: comments } = useQuery<Comment[]>({
    queryKey: [`/api/artworks/${artworkId}/comments`],
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest(
        "POST",
        `/api/artworks/${artworkId}/comments`,
        { content }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/artworks/${artworkId}/comments`],
      });
      setComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {user && (
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
          />
          <Button 
            onClick={() => commentMutation.mutate(comment)}
            disabled={!comment.trim() || commentMutation.isPending}
          >
            Post Comment
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">User #{comment.userId}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface Comment {
  id: number;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  const toggleCommentExpansion = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter(id => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <div className="flex gap-2">
            <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-[14px] text-[#B0B0B0]">{comment.username}</p>
              <div className="mt-2">
                <p className="text-[15px] text-black mb-1">{comment.content}</p>
                <div className="flex justify-end items-center gap-4 text-[13px] text-[#747472]">
                  <span>回复</span>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{comment.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.99107 5.01388C6.71343 4.22054 4.93104 4.42294 3.90469 5.7458L3.64689 6.07807C2.43395 7.64141 2.60908 9.87082 4.05126 11.2256L9.8451 16.6683C9.896 16.7161 9.93594 16.7536 9.971 16.7853C9.98168 16.795 9.99131 16.8036 10 16.8112C10.0087 16.8036 10.0184 16.795 10.0291 16.7853C10.0641 16.7536 10.1041 16.7161 10.1549 16.6683L15.9488 11.2256C17.391 9.87083 17.5661 7.64141 16.3532 6.07806L16.0954 5.74579C14.9925 4.32433 13.0167 4.19617 11.7313 5.20853L11.1126 4.42293C12.8068 3.08863 15.4213 3.24572 16.8854 5.1328L17.1432 5.46507C18.6724 7.43594 18.4516 10.2465 16.6335 11.9544L10.8396 17.3971L10.8267 17.4093C10.7382 17.4924 10.6476 17.5776 10.5632 17.6426C10.4679 17.716 10.3419 17.7952 10.1766 17.8277L10.0872 17.3726L10.1765 17.8277C10.06 17.8506 9.94007 17.8506 9.8235 17.8277L9.91979 17.337L9.8235 17.8277C9.6581 17.7952 9.53214 17.716 9.4369 17.6426C9.35248 17.5776 9.26183 17.4924 9.17339 17.4093L9.16043 17.3971L3.36658 11.9544C1.54846 10.2465 1.32768 7.43594 2.85681 5.46507L3.1146 5.1328C4.62018 3.19228 7.34225 3.08067 9.03005 4.54067L9.39149 4.85332L9.09548 5.22852L8.46703 6.02509C8.12975 6.4526 7.9105 6.73239 7.77855 6.95841C7.65376 7.17215 7.6537 7.26155 7.66388 7.31709C7.67405 7.37263 7.70581 7.4562 7.89826 7.61181C8.10178 7.77637 8.40598 7.96025 8.87292 8.24041L9.29203 8.49188L9.32109 8.50931C9.71842 8.74768 10.0597 8.95245 10.3094 9.15286C10.5764 9.36722 10.8011 9.62439 10.883 9.98862C10.9649 10.3528 10.872 10.6815 10.7224 10.9895C10.5826 11.2775 10.3618 11.6087 10.1047 11.9942L10.0859 12.0224L9.58274 12.7771L8.75069 12.2224L9.25387 11.4677C9.535 11.046 9.71645 10.7718 9.82282 10.5527C9.92287 10.3467 9.91945 10.2616 9.90741 10.208C9.89536 10.1544 9.86202 10.0761 9.6834 9.93268C9.49347 9.78022 9.21212 9.61012 8.77754 9.34937L8.35842 9.09791L8.32803 9.07967C7.89996 8.82286 7.53416 8.60341 7.26951 8.38942C6.98755 8.16143 6.75155 7.88645 6.68025 7.49731C6.60895 7.10816 6.73213 6.76737 6.91495 6.45423C7.08654 6.16031 7.35078 5.82543 7.65999 5.43353L7.68195 5.40571L7.99107 5.01388Z" fill="#747472"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 展开按钮或评论内容 */}
          {comment.replies && comment.replies.length > 0 && (
            <>
              {expandedComments.includes(comment.id) ? (
                <>
                  <div className="ml-12 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <img src={reply.avatar} alt={reply.username} className="w-5 h-5 rounded-full" />
                        <div className="flex-1">
                          <p className="text-[14px] text-[#B0B0B0]">{reply.username}</p>
                          <p className="text-[15px] text-black mb-1">{reply.content}</p>
                          <div className="flex justify-end items-center gap-4 text-[13px] text-[#747472]">
                            <span>回复</span>
                            <div className="flex items-center gap-1">
                              <Heart size={16} />
                              <span>{reply.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.26439 4.35248C6.193 3.73018 4.73373 3.91636 3.88656 5.00827L3.66372 5.29549C2.63668 6.61922 2.78497 8.50694 4.00611 9.65407L9.01435 14.3588C9.04873 14.3911 9.07698 14.4176 9.10185 14.4405C9.12671 14.4176 9.15496 14.3911 9.18934 14.3588L14.1976 9.65407C15.4187 8.50694 15.567 6.61922 14.54 5.29548L14.3171 5.00827C13.3883 3.81111 11.7238 3.70229 10.6404 4.55556L10.0216 3.76996C11.5138 2.59475 13.8171 2.7325 15.1072 4.39527L15.3301 4.68249C16.6733 6.41375 16.4793 8.88263 14.8823 10.3829L9.87402 15.0876L9.86188 15.099C9.78634 15.17 9.7057 15.2458 9.62999 15.3041C9.5435 15.3708 9.42491 15.446 9.26749 15.4769C9.1581 15.4984 9.04559 15.4984 8.9362 15.4769C8.77878 15.446 8.66019 15.3708 8.57371 15.3041C8.49799 15.2458 8.41735 15.17 8.34181 15.099L8.32967 15.0876L3.32144 10.3829C1.72435 8.88263 1.53041 6.41376 2.87364 4.68249L3.26868 4.98899L2.87364 4.68249L3.09648 4.39527C4.42308 2.68543 6.8211 2.58773 8.30775 3.87372L8.66919 4.18637L8.37318 4.56156L7.96604 5.07763C7.6559 5.47073 7.45431 5.72786 7.33001 5.93585C7.21175 6.13373 7.20706 6.21792 7.21279 6.26749C7.21533 6.28939 7.2193 6.31109 7.2247 6.33246C7.23691 6.38084 7.27114 6.45791 7.45187 6.601C7.64184 6.75141 7.9215 6.92037 8.35086 7.17798L8.37749 7.19396C8.74305 7.41327 9.05719 7.60173 9.29011 7.78489C9.53825 7.98001 9.75217 8.2123 9.84825 8.54125C9.86592 8.60173 9.87976 8.66327 9.88968 8.72549C9.94367 9.0639 9.84978 9.36542 9.70905 9.64798C9.57696 9.91322 9.37374 10.218 9.13725 10.5727L9.12003 10.5985L8.79755 11.0823L7.9655 10.5276L8.28798 10.0438C8.54654 9.65601 8.71343 9.40397 8.81392 9.20219C8.90897 9.01132 8.90985 8.93116 8.90217 8.88303C8.89886 8.86229 8.89425 8.84178 8.88836 8.82162C8.87469 8.77483 8.83959 8.70276 8.67198 8.57096C8.49478 8.43162 8.23606 8.27529 7.83637 8.03548L7.80852 8.01877C7.41476 7.78254 7.07817 7.58061 6.83113 7.38501C6.56904 7.17751 6.34397 6.92916 6.25512 6.57725C6.23894 6.51314 6.22701 6.44803 6.21941 6.38235C6.17773 6.0218 6.30013 5.70979 6.47162 5.42284C6.63327 5.15237 6.87641 4.84422 7.16084 4.48373L7.18095 4.45824L7.26439 4.35248Z" fill="#747472"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-2 ml-12">
                    <div className="h-px w-6 bg-black"></div>
                    <button 
                      className="flex items-center gap-2 text-[#747472] ml-4"
                      onClick={() => toggleCommentExpansion(comment.id)}
                    >
                      <span>收起</span>
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.9707 5.98535L5.98541 1.00006L1.00012 5.98535" stroke="black"/>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center mt-2 ml-12">
                  <div className="h-px w-6 bg-black"></div>
                  <button 
                    className="flex items-center gap-2 text-[#747472] ml-4"
                    onClick={() => toggleCommentExpansion(comment.id)}
                  >
                    <span>展开{comment.replies.length}条评论</span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.98529 5.98529L10.9706 1" stroke="black"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
