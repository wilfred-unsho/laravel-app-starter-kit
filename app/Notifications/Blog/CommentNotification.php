<?php

namespace App\Notifications\Blog;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Blog\Comment;

class CommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $comment;
    protected $type; // 'new', 'reply', 'approved'

    public function __construct(Comment $comment, string $type = 'new')
    {
        $this->comment = $comment;
        $this->type = $type;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $subject = match($this->type) {
            'new' => 'New comment on: ' . $this->comment->post->title,
            'reply' => 'New reply to your comment on: ' . $this->comment->post->title,
            'approved' => 'Your comment has been approved',
            default => 'Comment notification'
        };

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.blog.comment', [
                'comment' => $this->comment,
                'type' => $this->type,
                'post' => $this->comment->post,
                'url' => route('blog.show', [
                    'slug' => $this->comment->post->slug,
                    '#comment-' . $this->comment->id
                ]),
                'unsubscribeUrl' => route('blog.unsubscribe', [
                    'email' => $notifiable->email,
                    'token' => encrypt($notifiable->email)
                ])
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'post_id' => $this->comment->post_id,
            'post_title' => $this->comment->post->title,
            'commenter' => $this->comment->author_name,
            'type' => $this->type
        ];
    }
}
