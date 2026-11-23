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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ContentController extends Controller
{
    private function respond(Request $request, Builder $query, int $defaultPerPage = 12): JsonResponse
    {
        if (! $request->filled('per_page')) {
            return response()->json($query->get());
        }

        $perPage = max(1, min(100, (int) $request->input('per_page', $defaultPerPage)));

        return response()->json($query->paginate($perPage)->withQueryString());
    }

    private function searchTerm(Request $request): string
    {
        return trim((string) $request->input('search', $request->input('q', '')));
    }

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

    public function members(Request $request): JsonResponse
    {
        $query = Member::query()
            ->where('is_public', true)
            ->where('status', 'active')
            ->with('country:id,name');

        if ($search = $this->searchTerm($request)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($country = trim((string) $request->input('country', ''))) {
            $query->whereHas('country', fn (Builder $q) => $q->where('name', $country));
        }

        if ($category = trim((string) $request->input('category', ''))) {
            $query->where('category', $category);
        }

        return $this->respond($request, $query->orderBy('name'));
    }

    public function member(Member $member): JsonResponse
    {
        abort_unless($member->is_public, 404);

        return response()->json($member->load('country:id,name', 'contacts'));
    }

    public function news(Request $request): JsonResponse
    {
        $query = News::published()->with('category:id,name', 'tags:id,name,slug');

        if ($search = $this->searchTerm($request)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($category = trim((string) $request->input('category', ''))) {
            $query->whereHas('category', fn (Builder $q) => $q->where('name', $category));
        }

        if ($request->boolean('members_only')) {
            $query->where('is_members_only', true);
        }

        return $this->respond($request, $query->orderByDesc('published_at'));
    }

    public function newsItem(News $news): JsonResponse
    {
        abort_unless($news->status === 'published' && $news->published_at?->isPast(), 404);

        return response()->json($news->load('category:id,name', 'tags:id,name,slug'));
    }

    public function events(Request $request): JsonResponse
    {
        $query = Event::query()->withCount('registrations');

        if ($search = $this->searchTerm($request)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($type = trim((string) $request->input('type', ''))) {
            $query->where('type', $type);
        }

        if ($status = trim((string) $request->input('status', ''))) {
            $query->where('status', $status);
        }

        if ($request->boolean('upcoming')) {
            $query->where('starts_at', '>=', now());
        }

        return $this->respond($request, $query->orderByDesc('starts_at'));
    }

    public function event(Event $event): JsonResponse
    {
        return response()->json(
            $event->loadCount('registrations')->load('programs', 'speakers'),
        );
    }

    public function regulations(Request $request): JsonResponse
    {
        $query = Regulation::public();

        if ($search = $this->searchTerm($request)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($category = trim((string) $request->input('category', ''))) {
            $query->where('category', $category);
        }

        if ($type = trim((string) $request->input('type', ''))) {
            $query->where('type', $type);
        }

        return $this->respond($request, $query->orderByDesc('published_on'));
    }

    public function regulation(Regulation $regulation): JsonResponse
    {
        abort_unless($regulation->is_public, 404);

        return response()->json($regulation);
    }

    public function documents(Request $request): JsonResponse
    {
        $query = Document::public();

        if ($search = $this->searchTerm($request)) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($category = trim((string) $request->input('category', ''))) {
            $query->where('category', $category);
        }

        if ($type = trim((string) $request->input('type', ''))) {
            $query->where('type', $type);
        }

        return $this->respond($request, $query->orderByDesc('published_on'));
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

    public function publications(Request $request): JsonResponse
    {
        $query = Publication::query()->where('is_public', true);

        if ($search = $this->searchTerm($request)) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($type = trim((string) $request->input('type', ''))) {
            $query->where('type', $type);
        }

        return $this->respond($request, $query->orderByDesc('published_on'));
    }

    public function agencies(Request $request): JsonResponse
    {
        $query = Agency::approved();

        if ($search = $this->searchTerm($request)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('agreement_number', 'like', "%{$search}%");
            });
        }

        if ($country = trim((string) $request->input('country', ''))) {
            $query->where('country', $country);
        }

        if ($status = trim((string) $request->input('status', ''))) {
            $query->where('status', $status);
        }

        return $this->respond($request, $query->orderBy('name'));
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
