<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'nullable|exists:blog_posts,id',
            'notify_new_posts' => 'boolean',
            'notify_comments' => 'boolean',
            'notify_updates' => 'boolean'
        ]);

        if ($validated['post_id']) {
            $post = Post::findOrFail($validated['post_id']);
            auth()->user()->subscribeToPost($post, $validated);
            $message = 'You are now subscribed to updates for this post.';
        } else {
            auth()->user()->subscribeToBlog($validated);
            $message = 'You are now subscribed to blog updates.';
        }

        return back()->with('success', $message);
    }

    public function unsubscribe(Request $request)
    {
        try {
            $email = Crypt::decrypt($request->token);

            if ($email !== $request->email) {
                throw new \Exception('Invalid unsubscribe token');
            }

            $user = User::where('email', $email)->firstOrFail();

            if ($request->post_id) {
                $post = Post::findOrFail($request->post_id);
                $user->unsubscribeFromPost($post);
                $message = 'You have been unsubscribed from this post.';
            } else {
                $user->unsubscribeFromBlog();
                $message = 'You have been unsubscribed from all blog updates.';
            }

            return redirect()->route('blog.index')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->route('blog.index')->with('error', 'Invalid unsubscribe link.');
        }
    }

    public function preferences()
    {
        $subscriptions = auth()->user()->blogSubscriptions()
            ->with('post')
            ->get();

        return Inertia::render('Blog/Subscriptions', [
            'subscriptions' => $subscriptions,
            'generalSubscription' => $subscriptions->whereNull('post_id')->first()
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'subscriptions' => 'array',
            'subscriptions.*.id' => 'exists:blog_subscriptions,id',
            'subscriptions.*.notify_new_posts' => 'boolean',
            'subscriptions.*.notify_comments' => 'boolean',
            'subscriptions.*.notify_updates' => 'boolean'
        ]);

        foreach ($validated['subscriptions'] as $subscription) {
            auth()->user()->blogSubscriptions()
                ->where('id', $subscription['id'])
                ->update([
                    'notify_new_posts' => $subscription['notify_new_posts'],
                    'notify_comments' => $subscription['notify_comments'],
                    'notify_updates' => $subscription['notify_updates']
                ]);
        }

        return back()->with('success', 'Notification preferences updated successfully.');
    }
}
