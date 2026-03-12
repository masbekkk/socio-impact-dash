<?php

use App\Models\Reimbursement;
use App\Models\User;
use App\Http\Resources\V1\Reimbursement\ReimbursementResource;
use Illuminate\Http\Request;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$reimbursement = Reimbursement::first();
if (!$reimbursement) {
    echo "No reimbursement found\n";
    exit;
}

$user = User::first();
$request = Request::create('/api/v1/reimbursements/' . $reimbursement->id, 'GET');
$request->setUserResolver(fn() => $user);

$resource = new ReimbursementResource($reimbursement);
$data = $resource->toArray($request);

echo json_encode(['data' => $data], JSON_PRETTY_PRINT);
?>
