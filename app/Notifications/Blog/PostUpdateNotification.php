<?php

namespace App\Notifications\Blog;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Blog\Post;

class PostUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $post;
    protected $changes;

    public function __construct(Post $post, array $changes)
    {
        $this->post = $post;
        $this->changes = $changes;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Post Updated: ' . $this->post->title)
            ->markdown('emails.blog.post-update', [
                'post' => $this->post,
                'changes' => $this->changes,
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
            'editor' => $this->post->editor->name,
            'changes' => $this->changes
        ];
    }
}
