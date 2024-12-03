<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\IpRestriction;
use Symfony\Component\HttpFoundation\Response;

class CheckIpRestrictions
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        // Allow whitelisted IPs
        if (IpRestriction::isIpWhitelisted($ip)) {
            return $next($request);
        }

        // Block blacklisted IPs
        if (IpRestriction::isIpBlacklisted($ip)) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Access denied. Your IP address has been blocked.'
                ], 403);
            }

            abort(403, 'Access denied. Your IP address has been blocked.');
        }

        return $next($request);
    }
}
