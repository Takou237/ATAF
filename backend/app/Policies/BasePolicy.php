<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Socle des autorisations du back-office : chaque politique déclare la
 * permission Spatie qui ouvre sa ressource, et toutes les actions (voir,
 * créer, modifier, supprimer, restaurer) en dépendent.
 *
 * Les super-administrateurs ne sont pas concernés : AppServiceProvider leur
 * accorde toutes les abilities via Gate::before().
 */
abstract class BasePolicy
{
    /** Permission Spatie requise pour accéder à la ressource. */
    protected string $permission = '';

    public function viewAny(User $user): bool
    {
        return $this->allows($user);
    }

    public function view(User $user, Model $model): bool
    {
        return $this->allows($user);
    }

    public function create(User $user): bool
    {
        return $this->allows($user);
    }

    public function update(User $user, Model $model): bool
    {
        return $this->allows($user);
    }

    public function delete(User $user, Model $model): bool
    {
        return $this->allows($user);
    }

    public function deleteAny(User $user): bool
    {
        return $this->allows($user);
    }

    public function restore(User $user, Model $model): bool
    {
        return $this->allows($user);
    }

    public function restoreAny(User $user): bool
    {
        return $this->allows($user);
    }

    public function forceDelete(User $user, Model $model): bool
    {
        return $this->allows($user);
    }

    public function forceDeleteAny(User $user): bool
    {
        return $this->allows($user);
    }

    protected function allows(User $user): bool
    {
        return $this->permission !== '' && $user->can($this->permission);
    }
}
