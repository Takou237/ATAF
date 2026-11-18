<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\AgencyVerification;
use App\Models\BoardMember;
use App\Models\Document;
use App\Models\Event;
use App\Models\MediaItem;
use App\Models\Member;
use App\Models\News;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Regulation;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ContentController extends Controller
{
    public function settings(): JsonResponse
    {
        return response()->json(Setting::query()->pluck('value', 'key'));
    }

    public function pages(): JsonResponse
    {
        return response()->json(
            Page::query()->where('status', 'published')->orderBy('position')->get(),
        );
    }

    public function page(Page $page): JsonResponse
    {
        abort_unless($page->status === 'published', 404);

        return response()->json($page);
    }

    public function members(): JsonResponse
    {
        return response()->json(
            Member::query()
                ->where('is_public', true)
                ->where('status', 'active')
                ->with('country:id,name')
                ->orderBy('name')
                ->get(),
        );
    }

    public function member(Member $member): JsonResponse
    {
        abort_unless($member->is_public, 404);

        return response()->json($member->load('country:id,name', 'contacts'));
    }

    public function news(): JsonResponse
    {
        return response()->json(
            News::published()
                ->with('category:id,name', 'tags:id,name,slug')
                ->orderByDesc('published_at')
                ->get(),
        );
    }

    public function newsItem(News $news): JsonResponse
    {
        abort_unless($news->status === 'published' && $news->published_at?->isPast(), 404);

        return response()->json($news->load('category:id,name', 'tags:id,name,slug'));
    }

    public function events(): JsonResponse
    {
        return response()->json(
            Event::query()->withCount('registrations')->orderByDesc('starts_at')->get(),
        );
    }

    public function event(Event $event): JsonResponse
    {
        return response()->json(
            $event->loadCount('registrations')->load('programs', 'speakers'),
        );
    }

    public function regulations(): JsonResponse
    {
        return response()->json(
            Regulation::public()->orderByDesc('published_on')->get(),
        );
    }

    public function regulation(Regulation $regulation): JsonResponse
    {
        abort_unless($regulation->is_public, 404);

        return response()->json($regulation);
    }

    public function documents(): JsonResponse
    {
        return response()->json(Document::public()->orderByDesc('published_on')->get());
    }

    public function document(Document $document): JsonResponse
    {
        abort_unless($document->is_public, 404);

        return response()->json($document);
    }

    public function downloadDocument(Document $document): BinaryFileResponse|JsonResponse
    {
        abort_unless($document->is_public, 404);

        if (! $document->file_path || ! is_file(storage_path('app/public/'.$document->file_path))) {
            return response()->json(['message' => 'Fichier indisponible pour le moment.'], 404);
        }

        $document->increment('download_count');

        return response()->file(storage_path('app/public/'.$document->file_path));
    }

    public function publications(): JsonResponse
    {
        return response()->json(
            Publication::query()->where('is_public', true)->orderByDesc('published_on')->get(),
        );
    }

    public function agencies(): JsonResponse
    {
        return response()->json(Agency::approved()->orderBy('name')->get());
    }

    public function verifyAgency(Request $request, string $number): JsonResponse
    {
        $agency = Agency::query()->where('agreement_number', trim($number))->first();

        AgencyVerification::create([
            'agreement_number' => trim($number),
            'found' => (bool) $agency,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'created_at' => now(),
        ]);

        return response()->json([
            'found' => (bool) $agency,
            'agency' => $agency?->only(['id', 'name', 'agreement_number', 'country', 'city', 'status', 'valid_from', 'valid_until']),
        ]);
    }

    public function board(): JsonResponse
    {
        return response()->json(BoardMember::query()->orderBy('position')->get());
    }

    public function media(): JsonResponse
    {
        return response()->json(MediaItem::query()->orderBy('position')->get());
    }
}
