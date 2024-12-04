<?php

namespace App\Notifications\Blog;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Blog\Post;

class NewPostNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Blog Post: ' . $this->post->title)
            ->markdown('emails.blog.new-post', [
                'post' => $this->post,
                'url' => route('blog.show', $this->post->slug),
                'unsubscribeUrl' => route('blog.unsubscribe', [
                    'email' => $notifiable->email,
                    'token' => encrypt($notifiable->email)
                ])
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'author' => $this->post->author->name,
        ];
    }
}
