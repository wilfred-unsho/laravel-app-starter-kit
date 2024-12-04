<?php

namespace App\Notifications\Blog;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Blog\Comment;

class CommentRejected extends Notification
{
    use Queueable;

    protected $comment;

    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Comment Not Approved')
            ->line('Your comment on the post "' . $this->comment->post->title . '" was not approved.')
            ->line('This could be due to our community guidelines or content policies.')
            ->line('Please review our commenting guidelines for more information.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'comment_rejected',
            'post_id' => $this->comment->post_id,
            'post_title' => $this->comment->post->title,
        ];
    }
}
