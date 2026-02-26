<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\LetterRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LetterRequestController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('LetterRequests/Index', [
            'canAssign' => $user->hasRole([UserRole::Finance, UserRole::Superadmin]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LetterRequests/Create', [
            'projects' => Project::select('id', 'name', 'code')->get(),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('LetterRequests/Edit', [
            'letterRequestId' => $id,
            'projects' => Project::select('id', 'name', 'code')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'letter_date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
        ]);

        LetterRequest::create([
            ...$validated,
            'requester_id' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->route('letter-requests.index')->with('success', 'Pengajuan nomor surat berhasil dikirim.');
    }

    public function assignNumber(Request $request, LetterRequest $letterRequest): RedirectResponse
    {
        $user = auth()->user();
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            abort(403);
        }

        $validated = $request->validate([
            'letter_number' => 'required|string|max:255',
        ]);

        $letterRequest->update([
            'letter_number' => $validated['letter_number'],
            'status' => 'assigned',
        ]);

        return back()->with('success', 'Nomor surat berhasil diberikan.');
    }

    public function reject(LetterRequest $letterRequest): RedirectResponse
    {
        $user = auth()->user();
        if (! $user->hasRole([UserRole::Finance, UserRole::Superadmin])) {
            abort(403);
        }

        $letterRequest->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Pengajuan nomor surat ditolak.');
    }
}
