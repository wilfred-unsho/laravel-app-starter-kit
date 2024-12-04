<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckBlogPermissions
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!auth()->user()->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return redirect()->route('admin.dashboard')
                ->with('error', 'You do not have permission to access this section.');
        }

        return $next($request);
    }
}
