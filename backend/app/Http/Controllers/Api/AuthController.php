<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AuthController extends Controller
{
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'Si un compte existe pour cette adresse, un email de réinitialisation a été envoyé.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset($data, function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();

            $user->tokens()->delete();
        });

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => ['Ce lien de réinitialisation est invalide ou expiré.'],
            ]);
        }

        return response()->json(['message' => 'Votre mot de passe a été réinitialisé.']);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est inactif.'],
            ]);
        }

        $token = $user->createToken($credentials['device_name'] ?? 'spa')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'organisation' => $user->organisation,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('profile.member');

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'organisation' => $user->organisation,
            'phone' => $user->phone,
            'status' => $user->status,
            'roles' => $user->getRoleNames(),
            'profile' => $user->profile,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'organisation' => $user->organisation,
                'phone' => $user->phone,
                'status' => $user->status,
                'roles' => $user->getRoleNames(),
            ],
        ]);
    }

    public function myRegistrations(Request $request): JsonResponse
    {
        $registrations = EventRegistration::query()
            ->where('user_id', $request->user()->id)
            ->orWhere('email', $request->user()->email)
            ->with('event')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($registrations);
    }

    public function myDocuments(Request $request): JsonResponse
    {
        $documents = Document::query()
            ->orderByDesc('published_on')
            ->get();

        return response()->json($documents);
    }

    public function downloadDocument(Request $request, Document $document): BinaryFileResponse|JsonResponse
    {
        $relativePath = ltrim((string) $document->file_path, '/');
        $paths = [
            storage_path('app/public/'.$relativePath),
            storage_path('app/'.$relativePath),
        ];
        $filePath = collect($paths)->first(fn (string $path): bool => is_file($path));

        if (! $filePath) {
            return response()->json(['message' => 'Fichier indisponible pour le moment.'], 404);
        }

        $document->increment('download_count');

        return response()->file($filePath);
    }
}
