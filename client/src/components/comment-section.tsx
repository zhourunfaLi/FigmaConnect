import * as React from "react";
import { useState } from "react";
import { Comment } from "@/shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/fetch";
import { formatDate } from "@/lib/utils";
import { Trash2, Shield, Flag } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function CommentSection({ artworkId }: { artworkId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchApi<Comment[]>(`/api/artworks/${artworkId}/comments`)
      .then(setComments)
      .finally(() => setLoading(false));

    // 检查评论是否启用
    fetchApi<{commentsEnabled: boolean}>(`/api/artworks/${artworkId}`)
      .then(data => setCommentsEnabled(data.commentsEnabled !== false))
      .catch(err => console.error("Failed to check comments status:", err));
  }, [artworkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentsEnabled) return;

    try {
      const comment = await fetchApi<Comment>(`/api/artworks/${artworkId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newComment }),
      });

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast({
        title: "评论失败",
        description: "无法发表评论，请稍后再试",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await fetchApi(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      setComments(comments.filter(c => c.id !== commentId));
      toast({
        title: "评论已删除",
        description: "评论已成功删除",
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast({
        title: "删除失败",
        description: "无法删除评论，请稍后再试",
        variant: "destructive"
      });
    }
  };

  const handleReportComment = async (commentId: number) => {
    try {
      await fetchApi(`/api/comments/${commentId}/report`, {
        method: "POST",
      });

      toast({
        title: "评论已举报",
        description: "感谢您的举报，我们会尽快审核",
      });
    } catch (error) {
      console.error("Failed to report comment:", error);
      toast({
        title: "举报失败",
        description: "无法举报评论，请稍后再试",
        variant: "destructive"
      });
    }
  };

  const toggleCommentsStatus = async () => {
    try {
      await fetchApi(`/api/artworks/${artworkId}/comments/toggle`, {
        method: "POST",
      });

      setCommentsEnabled(!commentsEnabled);
      toast({
        title: commentsEnabled ? "评论已关闭" : "评论已开启",
        description: commentsEnabled ? "此作品的评论功能已关闭" : "此作品的评论功能已开启",
      });
    } catch (error) {
      console.error("Failed to toggle comments:", error);
      toast({
        title: "操作失败",
        description: "无法更改评论状态，请稍后再试",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="py-4">Loading comments...</div>;
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">评论 ({comments.length})</h2>
        {isAdmin && (
          <Button 
            variant={commentsEnabled ? "outline" : "secondary"}
            onClick={toggleCommentsStatus}
          >
            {commentsEnabled ? "关闭评论" : "开启评论"}
          </Button>
        )}
      </div>

      {user && commentsEnabled ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="发表你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            发表评论
          </Button>
        </form>
      ) : !user ? (
        <div className="p-4 text-center border rounded-md">
          <p>请登录后发表评论</p>
        </div>
      ) : (
        <div className="p-4 text-center border rounded-md">
          <p>评论功能已关闭</p>
        </div>
      )}

      <div className="space-y-6 pt-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">暂无评论</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{comment.username[0]}</AvatarFallback>
                <AvatarImage src={`https://avatar.vercel.sh/${comment.username}`} />
              </Avatar>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="flex gap-2">
                {(isAdmin || user?.id === comment.userId) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          您确定要删除这条评论吗？此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {user && user.id !== comment.userId && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleReportComment(comment.id)}
                    title="举报评论"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}