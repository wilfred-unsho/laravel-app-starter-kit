<?php

namespace App\Notifications\Blog;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Blog\Comment;

class CommentApproved extends Notification
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
        $url = url('/blog/' . $this->comment->post->slug . '#comment-' . $this->comment->id);

        return (new MailMessage)
            ->subject('Your Comment Has Been Approved')
            ->line('Your comment on the post "' . $this->comment->post->title . '" has been approved.')
            ->action('View Comment', $url)
            ->line('Thank you for contributing to our blog!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'comment_approved',
            'comment_id' => $this->comment->id,
            'post_id' => $this->comment->post_id,
            'post_title' => $this->comment->post->title,
        ];
    }
}
