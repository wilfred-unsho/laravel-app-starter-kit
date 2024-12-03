<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    public function log(string $action, ?Model $subject = null, ?string $description = null, array $properties = []): ActivityLog
    {
        return ActivityLog::log($action, $subject, $description, $properties);
    }

    public function logUserAction(string $action, Model $user, string $description = null, array $properties = []): ActivityLog
    {
        return $this->log(
            action: $action,
            subject: $user,
            description: $description ?? "User {$action}",
            properties: $properties
        );
    }

    public function logAuthAction(string $action, string $description = null, array $properties = []): ActivityLog
    {
        return $this->log(
            action: $action,
            description: $description,
            properties: array_merge($properties, [
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
        );
    }

    public function getActivityForUser($userId, $limit = 10)
    {
        return ActivityLog::where('user_id', $userId)
            ->with('subject')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getRecentActivity($limit = 20)
    {
        return ActivityLog::with(['user', 'subject'])
            ->latest()
            ->limit($limit)
            ->get();
    }
}
