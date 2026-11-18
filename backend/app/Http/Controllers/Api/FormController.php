<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgencyApplication;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\MembershipApplication;
use App\Models\NewsletterList;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function contact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'website' => ['prohibited'],
        ]);

        unset($data['website']);

        ContactMessage::create($data + ['status' => 'new']);

        return response()->json(['message' => 'Votre message a bien été envoyé.'], 201);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'list' => ['nullable', 'string', 'max:64'],
        ]);

        $list = NewsletterList::firstOrCreate(
            ['slug' => $data['list'] ?? 'general'],
            ['name' => 'Newsletter générale'],
        );

        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $data['email']],
            [
                'newsletter_list_id' => $list->id,
                'name' => $data['name'] ?? null,
                'status' => 'subscribed',
                'consent_at' => now(),
                'unsubscribed_at' => null,
            ],
        );

        return response()->json(['message' => 'Inscription confirmée.', 'token' => $subscriber->token], 201);
    }

    public function unsubscribe(string $token): JsonResponse
    {
        $subscriber = NewsletterSubscriber::query()->where('token', $token)->firstOrFail();

        $subscriber->update(['status' => 'unsubscribed', 'unsubscribed_at' => now()]);

        return response()->json(['message' => 'Désinscription effectuée.']);
    }

    public function registerToEvent(Request $request, Event $event): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'function' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'participation_type' => ['nullable', 'string', 'max:64'],
            'special_needs' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($event->capacity !== null && $event->registrations()->count() >= $event->capacity) {
            return response()->json(['message' => 'Cet événement est complet.'], 422);
        }

        $registration = EventRegistration::firstOrCreate(
            ['event_id' => $event->id, 'email' => $data['email']],
            $data + ['status' => 'confirmed'],
        );

        return response()->json([
            'message' => 'Inscription enregistrée.',
            'registration' => $registration,
        ], 201);
    }

    public function membershipApplication(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'organisation' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'category' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        MembershipApplication::create($data + ['status' => 'pending']);

        return response()->json(['message' => "Votre demande d'adhésion a été transmise."], 201);
    }

    public function agencyApplication(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'agency_name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        AgencyApplication::create($data + ['status' => 'pending']);

        return response()->json(['message' => "Votre demande d'agrément a été transmise."], 201);
    }
}
