<?php

declare(strict_types=1);

use App\Actions\CreateUser;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

it('may create a user', function (): void {
    Event::fake([Registered::class]);

    $action = resolve(CreateUser::class);

    $division = App\Models\Division::factory()->create();
    $user = $action->handle([
        'name' => 'Test User',
        'email' => 'example@email.com',
        'nip' => '123456789',
        'division_id' => $division->id,
    ], 'password');

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->name)->toBe('Test User')
        ->and($user->email)->toBe('example@email.com')
        ->and($user->nip)->toBe('123456789')
        ->and($user->division_id)->toBe($division->id)
        ->and($user->password)->not->toBe('password');

    Event::assertDispatched(Registered::class);
});
