<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementRequest;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Enums\ReimbursementType;
use Inertia\Inertia;

final class ReimbursementController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Reimbursements/Index');
    }

    public function createATR()
    {
        $json = file_get_contents(database_path('data/projects.json'));
        $data = json_decode($json, true);

        $projects = collect($data)->map(function ($p, $index) {
            return (object) [
                'id' => $index + 1,
                'name' => $p['name'],
                'code' => $p['code'],
                'operational_budget' => $p['budget_total'] * 0.50,
                'used_operational_budget' => '0' // Dummy
            ];
        });

        return Inertia::render('Reimbursements/CreateATR', [
            'projects' => $projects
        ]);
    }

    public function createAllowance()
    {
        $json = file_get_contents(database_path('data/projects.json'));
        $data = json_decode($json, true);

        $projects = collect($data)->map(function ($p, $index) {
            return (object) [
                'id' => $index + 1,
                'name' => $p['name'],
                'code' => $p['code'],
                'allowance_budget' => $p['budget_total'] * 0.20,
                'used_allowance_budget' => '0' // Dummy
            ];
        });

        return Inertia::render('Reimbursements/CreateAllowance', [
            'projects' => $projects
        ]);
    }

    public function createEER()
    {
        return Inertia::render('Reimbursements/CreateEER');
    }

    public function approvals()
    {
        return Inertia::render('Reimbursements/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReimbursementRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('Reimbursements/Show', [
            'slug' => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reimbursement $reimbursement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReimbursementRequest $request, Reimbursement $reimbursement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reimbursement $reimbursement)
    {
        //
    }

    public function approve(Reimbursement $reimbursement)
    {
        // Logic to approve
        return back();
    }

    public function reject(Reimbursement $reimbursement)
    {
        // Logic to reject
        return back();
    }
}
