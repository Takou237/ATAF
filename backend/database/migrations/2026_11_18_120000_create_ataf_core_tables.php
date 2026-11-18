<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('organisation')->nullable()->after('email');
            $table->string('phone')->nullable()->after('organisation');
            $table->string('status')->default('active')->after('phone');
        });

        // ---------------------------------------------------------------
        // Référentiel
        // ---------------------------------------------------------------
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 2)->nullable();
            $table->string('region')->nullable();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // ---------------------------------------------------------------
        // Membres
        // ---------------------------------------------------------------
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_path')->nullable();
            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->default('Compagnie aérienne');
            $table->string('status')->default('active');
            $table->smallInteger('joined_year')->nullable();
            $table->boolean('is_public')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('member_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('organisation');
            $table->string('country');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('category')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('member_id')->nullable()->constrained()->nullOnDelete();
            $table->string('role')->nullable();
            $table->string('phone')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        // ---------------------------------------------------------------
        // Contenus éditoriaux
        // ---------------------------------------------------------------
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->longText('body')->nullable();
            $table->json('sections')->nullable();
            $table->string('status')->default('published');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('board_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('company')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('group')->default('board');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->string('image_path')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->string('status')->default('draft');
            $table->boolean('is_members_only')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('news_tag', function (Blueprint $table) {
            $table->foreignId('news_id')->constrained('news')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['news_id', 'tag_id']);
        });

        // ---------------------------------------------------------------
        // Événements
        // ---------------------------------------------------------------
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('type')->default('Séminaire');
            $table->string('status')->default('open');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->unsignedInteger('capacity')->nullable();
            $table->string('image_path')->nullable();
            $table->json('documents')->nullable();
            $table->timestamps();
        });

        Schema::create('event_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('time');
            $table->string('title');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('event_speakers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('photo_path')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('function')->nullable();
            $table->string('company')->nullable();
            $table->string('country')->nullable();
            $table->string('phone')->nullable();
            $table->string('email');
            $table->string('participation_type')->nullable();
            $table->text('special_needs')->nullable();
            $table->string('status')->default('confirmed');
            $table->timestamps();
            $table->unique(['event_id', 'email']);
        });

        // ---------------------------------------------------------------
        // Réglementation & documentation
        // ---------------------------------------------------------------
        Schema::create('regulations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->date('published_on')->nullable();
            $table->string('category')->nullable();
            $table->string('type')->default('Note d\'information');
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('document_path')->nullable();
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->string('type')->default('PDF');
            $table->string('file_path')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->boolean('is_public')->default(false);
            $table->unsignedInteger('download_count')->default(0);
            $table->date('published_on')->nullable();
            $table->timestamps();
        });

        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('Rapport');
            $table->date('published_on')->nullable();
            $table->unsignedInteger('pages')->nullable();
            $table->string('file_path')->nullable();
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });

        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('photo');
            $table->string('url')->nullable();
            $table->string('file_path')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->foreignId('event_id')->nullable()->constrained()->nullOnDelete();
            $table->date('published_on')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        // ---------------------------------------------------------------
        // Agences agréées
        // ---------------------------------------------------------------
        Schema::create('agencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('agreement_number')->unique();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('status')->default('approved');
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });

        Schema::create('agency_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('agreement_number');
            $table->boolean('found')->default(false);
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('agency_applications', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('agency_name');
            $table->string('country');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // ---------------------------------------------------------------
        // Communication
        // ---------------------------------------------------------------
        Schema::create('newsletter_lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('newsletter_list_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('token', 64)->unique();
            $table->string('status')->default('pending');
            $table->timestamp('consent_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->longText('body')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('sent_at')->nullable();
            $table->unsignedInteger('recipients_count')->default(0);
            $table->unsignedInteger('opens_count')->default(0);
            $table->unsignedInteger('clicks_count')->default(0);
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('organisation')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('new');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('newsletter_campaigns');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('newsletter_lists');
        Schema::dropIfExists('agency_applications');
        Schema::dropIfExists('agency_verifications');
        Schema::dropIfExists('agencies');
        Schema::dropIfExists('media_items');
        Schema::dropIfExists('publications');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('regulations');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('event_speakers');
        Schema::dropIfExists('event_programs');
        Schema::dropIfExists('events');
        Schema::dropIfExists('news_tag');
        Schema::dropIfExists('news');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('news_categories');
        Schema::dropIfExists('board_members');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('member_profiles');
        Schema::dropIfExists('membership_applications');
        Schema::dropIfExists('member_contacts');
        Schema::dropIfExists('members');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('countries');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['organisation', 'phone', 'status']);
        });
    }
};
