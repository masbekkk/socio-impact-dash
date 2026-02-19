<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\LetterRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class LetterRequestController
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('LetterRequests/Index', [
            'canAssign' => $user->hasRole([UserRole::Finance, UserRole::Superadmin]),
        ]);
    }

    public function create()
    {
        return Inertia::render('LetterRequests/Create', [
            'projects' => Project::select('id', 'name', 'code')->get(),
        ]);
    }

    public function store(Request $request)
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

    public function assignNumber(Request $request, LetterRequest $letterRequest)
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

    public function reject(LetterRequest $letterRequest)
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
