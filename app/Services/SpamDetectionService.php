<?php

namespace App\Services;

use App\Models\Blog\Comment;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SpamDetectionService
{
    protected $spamScore = 0;
    protected $spamThreshold = 5;
    protected $reasons = [];

    public function analyzeComment(Comment $comment)
    {
        $this->checkIPHistory($comment);
        $this->checkEmailHistory($comment);
        $this->checkContent($comment);
        $this->checkLinks($comment);
        $this->checkPostingFrequency($comment);

        return [
            'isSpam' => $this->spamScore >= $this->spamThreshold,
            'score' => $this->spamScore,
            'reasons' => $this->reasons
        ];
    }

    protected function checkIPHistory($comment)
    {
        // Check if IP is in blacklist
        $isBlacklisted = DB::table('spam_ips')
            ->where('ip_address', $comment->ip_address)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();

        if ($isBlacklisted) {
            $this->spamScore += 5;
            $this->reasons[] = 'IP address is blacklisted';
        }

        // Check IP comment frequency
        $recentComments = Cache::remember(
            "ip_comments:{$comment->ip_address}",
            now()->addHours(1),
            fn() => Comment::where('ip_address', $comment->ip_address)
                ->where('created_at', '>', now()->subHour())
                ->count()
        );

        if ($recentComments > 10) {
            $this->spamScore += 2;
            $this->reasons[] = 'High frequency posting from IP';
        }
    }

    protected function checkEmailHistory($comment)
    {
        if (!$comment->author_email) return;

        // Check if email is in spam list
        $isSpamEmail = DB::table('spam_emails')
            ->where('email', $comment->author_email)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();

        if ($isSpamEmail) {
            $this->spamScore += 5;
            $this->reasons[] = 'Email address is blacklisted';
        }

        // Check for disposable email services
        $disposablePatterns = ['@temporary', '@disposable', '@throwaway'];
        foreach ($disposablePatterns as $pattern) {
            if (str_contains($comment->author_email, $pattern)) {
                $this->spamScore += 3;
                $this->reasons[] = 'Disposable email detected';
                break;
            }
        }
    }

    protected function checkContent($comment)
    {
        // Check for spam patterns
        $spamPatterns = Cache::remember('spam_patterns', now()->addDay(), function () {
            return DB::table('spam_patterns')->get();
        });

        foreach ($spamPatterns as $pattern) {
            if (preg_match("/{$pattern->pattern}/i", $comment->content)) {
                $this->spamScore += $pattern->score;
                $this->reasons[] = "Matched spam pattern: {$pattern->type}";
            }
        }

        // Check for repeated characters
        if (preg_match('/(.)\1{4,}/', $comment->content)) {
            $this->spamScore += 1;
            $this->reasons[] = 'Repeated characters detected';
        }
    }

    protected function checkLinks($comment)
    {
        // Count URLs in content
        $urlCount = preg_match_all('/https?:\/\/\S+/i', $comment->content);

        if ($urlCount > 2) {
            $this->spamScore += $urlCount;
            $this->reasons[] = 'Multiple URLs detected';
        }

        // Check for blacklisted domains
        $blacklistedDomains = Cache::remember('blacklisted_domains', now()->addDay(), function () {
            // Fetch from database or external service
            return ['spam.com', 'scam.net'];
        });

        foreach ($blacklistedDomains as $domain) {
            if (str_contains($comment->content, $domain)) {
                $this->spamScore += 5;
                $this->reasons[] = 'Blacklisted domain detected';
            }
        }
    }

    protected function checkPostingFrequency($comment)
    {
        // Check how many comments this user/email has made recently
        $timeWindow = now()->subMinutes(5);
        $recentComments = Comment::where('created_at', '>', $timeWindow)
            ->where(function ($query) use ($comment) {
                $query->where('ip_address', $comment->ip_address)
                    ->orWhere('author_email', $comment->author_email);
            })
            ->count();

        if ($recentComments > 5) {
            $this->spamScore += 3;
            $this->reasons[] = 'Rapid posting detected';
        }
    }
}
