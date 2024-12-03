<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, ...$permissions)
    {
        if (!$request->user()) {
            return redirect('login');
        }

        // Super admin bypass
        if ($request->user()->hasRole('super-admin')) {
            return $next($request);
        }

        // Check if user has any of the required permissions
        foreach ($permissions as $permission) {
            if ($request->user()->hasPermission($permission)) {
                return $next($request);
            }
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Unauthorized. Insufficient permissions.'], 403);
        }

        return redirect()->route('admin.dashboard')
            ->with('error', 'You do not have permission to access this resource.');
    }
}
