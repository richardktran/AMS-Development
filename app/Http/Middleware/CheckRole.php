<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $userRole = $request->user()->role()->first();
        if ($userRole) {
            // Set scope based on user role
            $request->request->add([
                'scope' => $userRole->role_name
            ]);
        }

        return $next($request);
    }
}
