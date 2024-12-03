<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return redirect('login');
        }

        // Super admin bypass
        if ($request->user()->hasRole('super-admin')) {
            return $next($request);
        }

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return redirect()->route('admin.dashboard')
            ->with('error', 'You do not have permission to access this resource.');
    }
}
