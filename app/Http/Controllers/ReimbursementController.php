<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementRequest;
use App\Models\Reimbursement;

final class ReimbursementController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(Reimbursement $reimbursement)
    {
        //
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
}
