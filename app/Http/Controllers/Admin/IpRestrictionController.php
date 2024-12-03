<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IpRestriction;
use App\Services\AdminMenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IpRestrictionController extends Controller
{
    protected $menuService;

    public function __construct(AdminMenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    protected function getSharedProps()
    {
        return [
            'menu_items' => $this->menuService->getVisibleMenuItems(),
        ];
    }

    public function index(Request $request)
    {
        $query = IpRestriction::with('creator')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('ip_address', 'like', "%{$search}%")
                        ->orWhere('reason', 'like', "%{$search}%");
                });
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    $query->where(function ($query) {
                        $query->whereNull('expires_at')
                            ->orWhere('expires_at', '>', now());
                    });
                } elseif ($status === 'expired') {
                    $query->where('expires_at', '<=', now());
                }
            });

        $restrictions = $query->latest()
            ->paginate(15)
            ->through(fn ($restriction) => [
                'id' => $restriction->id,
                'ip_address' => $restriction->ip_address,
                'type' => $restriction->type,
                'reason' => $restriction->reason,
                'creator' => $restriction->creator ? [
                    'id' => $restriction->creator->id,
                    'name' => $restriction->creator->name,
                ] : null,
                'expires_at' => $restriction->expires_at,
                'created_at' => $restriction->created_at,
            ]);

        return Inertia::render('Admin/Security/IpRestrictions', array_merge([
            'title' => 'IP Restrictions',
            'restrictions' => $restrictions,
            'filters' => $request->only(['search', 'type', 'status']),
        ], $this->getSharedProps()));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ip_address' => ['required', 'ip'],
            'type' => ['required', 'in:whitelist,blacklist'],
            'reason' => ['nullable', 'string', 'max:255'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);

        $restriction = new IpRestriction($validated);
        $restriction->created_by = auth()->id();
        $restriction->save();

        return back()->with('message', 'IP restriction added successfully');
    }

    public function destroy(IpRestriction $ipRestriction)
    {
        $ipRestriction->delete();

        return back()->with('message', 'IP restriction removed successfully');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'selected' => 'required|array',
            'selected.*' => 'exists:ip_restrictions,id',
        ]);

        IpRestriction::whereIn('id', $request->selected)->delete();

        return back()->with('message', 'Selected restrictions removed successfully');
    }
}
