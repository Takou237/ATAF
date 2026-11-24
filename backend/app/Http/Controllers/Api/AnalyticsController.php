<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'path' => ['required', 'string', 'max:500'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        PageView::query()->create([
            'path' => $data['path'],
            'page_title' => $data['title'] ?? null,
            'ip_hash' => $request->ip() ? hash('sha256', $request->ip().'|'.config('app.key')) : null,
            'visited_at' => now(),
        ]);

        return response()->json(['recorded' => true], 202);
    }
}
