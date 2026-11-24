<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\FormController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'ATAF']));
Route::post('/analytics/page-view', [AnalyticsController::class, 'store'])->middleware('throttle:60,1');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
        Route::get('/me/registrations', [AuthController::class, 'myRegistrations']);
        Route::get('/me/documents', [AuthController::class, 'myDocuments']);
        Route::get('/me/documents/{document:slug}/download', [AuthController::class, 'downloadDocument']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/settings', [ContentController::class, 'settings']);
Route::get('/pages', [ContentController::class, 'pages']);
Route::get('/pages/{page:slug}', [ContentController::class, 'page']);
Route::get('/members', [ContentController::class, 'members']);
Route::get('/members/{member:slug}', [ContentController::class, 'member']);
Route::get('/news', [ContentController::class, 'news']);
Route::get('/news/{news:slug}', [ContentController::class, 'newsItem']);
Route::get('/news/{news:slug}/download', [ContentController::class, 'downloadNewsAttachment']);
Route::get('/events', [ContentController::class, 'events']);
Route::get('/events/{event:slug}', [ContentController::class, 'event']);
Route::get('/regulations', [ContentController::class, 'regulations']);
Route::get('/regulations/{regulation:slug}', [ContentController::class, 'regulation']);
Route::get('/documents', [ContentController::class, 'documents']);
Route::get('/documents/{document:slug}', [ContentController::class, 'document']);
Route::get('/documents/{document:slug}/download', [ContentController::class, 'downloadDocument']);
Route::get('/publications', [ContentController::class, 'publications']);
Route::get('/agencies', [ContentController::class, 'agencies']);
Route::get('/agencies/verify/{number}', [ContentController::class, 'verifyAgency']);
Route::get('/agencies/{number}/attestation', [ContentController::class, 'attestation']);
Route::get('/board-members', [ContentController::class, 'board']);
Route::get('/media', [ContentController::class, 'media']);

Route::middleware('throttle:20,1')->group(function () {
    Route::post('/contact-messages', [FormController::class, 'contact']);
    Route::post('/newsletter/subscribe', [FormController::class, 'subscribe']);
    Route::post('/events/{event:slug}/registrations', [FormController::class, 'registerToEvent']);
    Route::post('/membership-applications', [FormController::class, 'membershipApplication']);
    Route::post('/agency-applications', [FormController::class, 'agencyApplication']);
});

Route::get('/newsletter/unsubscribe/{token}', [FormController::class, 'unsubscribe']);
