<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\BlogNotificationService;
use App\Models\Blog\Post;
use App\Models\Blog\Comment;

class ProcessBlogNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $type;
    protected $modelId;
    protected $additionalData;

    public function __construct(string $type, int $modelId, array $additionalData = [])
    {
        $this->type = $type;
        $this->modelId = $modelId;
        $this->additionalData = $additionalData;
    }

    public function handle(BlogNotificationService $notificationService)
    {
        switch ($this->type) {
            case 'new_post':
                $post = Post::findOrFail($this->modelId);
                $notificationService->notifyNewPost($post);
                break;

            case 'new_comment':
                $comment = Comment::findOrFail($this->modelId);
                $notificationService->notifyNewComment($comment);
                break;

            case 'comment_approved':
                $comment = Comment::findOrFail($this->modelId);
                $notificationService->notifyCommentApproved($comment);
                break;

            case 'post_update':
                $post = Post::findOrFail($this->modelId);
                $notificationService->notifyPostUpdate($post, $this->additionalData['changes'] ?? []);
                break;
        }
    }

    public function retryUntil()
    {
        return now()->addHours(12);
    }

    public function failed(\Throwable $exception)
    {
        \Log::error('Blog notification failed', [
            'type' => $this->type,
            'model_id' => $this->modelId,
            'error' => $exception->getMessage()
        ]);
    }
}
