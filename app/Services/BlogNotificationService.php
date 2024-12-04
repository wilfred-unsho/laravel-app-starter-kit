<?php

namespace App\Services;

use App\Models\Blog\{Post, Comment};
use App\Models\User;
use App\Notifications\Blog\{
    NewPostNotification,
    CommentNotification,
    PostUpdateNotification
};
use Illuminate\Support\Facades\Notification;

class BlogNotificationService
{
    public function notifyNewPost(Post $post)
    {
        if (!config('blog.notifications.email.new_post')) {
            return;
        }

        // Notify subscribers
        $subscribers = User::whereHas('blogSubscriptions', function($query) {
            $query->where('notify_new_posts', true);
        })->get();

        Notification::send($subscribers, new NewPostNotification($post));

        // Notify admins
        $admins = User::permission('manage-blog')->get();
        Notification::send($admins, new NewPostNotification($post));
    }

    public function notifyNewComment(Comment $comment)
    {
        if (!config('blog.notifications.email.new_comment')) {
            return;
        }

        // Get users to notify
        $usersToNotify = collect();

        // Post author
        $usersToNotify->push($comment->post->author);

        // Parent comment author (if reply)
        if ($comment->parent_id) {
            $parentAuthor = $comment->parent->user;
            if ($parentAuthor) {
                $usersToNotify->push($parentAuthor);
            }
        }

        // Post subscribers
        $subscribers = User::whereHas('blogSubscriptions', function($query) use ($comment) {
            $query->where('post_id', $comment->post_id)
                ->where('notify_comments', true);
        })->get();

        $usersToNotify = $usersToNotify->merge($subscribers)->unique('id');

        // Send notifications
        foreach ($usersToNotify as $user) {
            $type = $comment->parent_id && $comment->parent->user_id === $user->id
                ? 'reply'
                : 'new';

            $user->notify(new CommentNotification($comment, $type));
        }
    }

    public function notifyCommentApproved(Comment $comment)
    {
        // Only notify if comment has an associated user
        if ($comment->user_id) {
            $comment->user->notify(new CommentNotification($comment, 'approved'));
        }
    }

    public function notifyPostUpdate(Post $post, array $changes)
    {
        // Notify subscribers of this specific post
        $subscribers = User::whereHas('blogSubscriptions', function($query) use ($post) {
            $query->where('post_id', $post->id)
                ->where('notify_updates', true);
        })->get();

        Notification::send($subscribers, new PostUpdateNotification($post, $changes));
    }
}
