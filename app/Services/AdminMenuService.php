<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminMenuService
{
    public function getVisibleMenuItems()
    {
        $user = Auth::user();
        if (!$user) {
            Log::info('No authenticated user found');
            return [];
        }

        // Get the menu items from config file
        $allMenuItems = config('admin-menu');
        if (!$allMenuItems) {
            Log::warning('Admin menu configuration not found');
            return [];
        }

        // For development/testing: if user is super-admin, return all items
        if ($user->hasRole('super-admin')) {
            Log::info('User is super-admin, returning all menu items');
            return $this->processMenuItems($allMenuItems);
        }

        // Filter menu items based on permissions
        $visibleItems = $this->filterMenuItems($allMenuItems, $user);

        return array_values($visibleItems);
    }

    protected function processMenuItems($items)
    {
        return array_map(function ($item) {
            if (isset($item['submenu'])) {
                $item['submenu'] = $this->processMenuItems($item['submenu']);
            }
            return $item;
        }, $items);
    }

    protected function filterMenuItems($items, $user)
    {
        return array_filter(array_map(function ($item) use ($user) {
            // Check permission for the menu item
            if (isset($item['permission']) && !$user->can($item['permission'])) {
                Log::debug('User lacks permission for menu item', [
                    'user' => $user->id,
                    'permission' => $item['permission']
                ]);
                return null;
            }

            // Process submenu if exists
            if (isset($item['submenu'])) {
                $filteredSubmenu = $this->filterMenuItems($item['submenu'], $user);

                // If no accessible submenu items, hide the parent
                if (empty($filteredSubmenu)) {
                    return null;
                }

                $item['submenu'] = array_values($filteredSubmenu);
            }

            return $item;
        }, $items));
    }

    public function getVisibleRoutes()
    {
        $user = Auth::user();
        $routes = [];

        if (!$user) {
            return $routes;
        }

        $this->extractRoutes(config('admin-menu'), $routes, $user);
        return array_unique($routes);
    }

    protected function extractRoutes($items, &$routes, $user)
    {
        foreach ($items as $item) {
            if ($user->hasRole('super-admin') ||
                !isset($item['permission']) ||
                $user->can($item['permission'])) {

                if (isset($item['route'])) {
                    $routes[] = $item['route'];
                }

                if (isset($item['submenu'])) {
                    $this->extractRoutes($item['submenu'], $routes, $user);
                }
            }
        }
    }
}
