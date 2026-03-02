<?php

declare(strict_types=1);

/**
 * Deploy Webhook Script (placed in /public/ for Hostinger .htaccess compatibility)
 *
 * SETUP:
 * 1. Generate a secret: openssl rand -hex 32
 * 2. Add DEPLOY_SECRET=your_secret to your .env
 * 3. Add DEPLOY_WEBHOOK_SECRET and DEPLOY_WEBHOOK_URL to GitHub Secrets
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit(1);
}

// Project root is one level up from /public/
$projectPath = dirname(__DIR__);
$envFile = $projectPath . '/.env';
$secret = null;

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }
        if (str_starts_with($line, 'DEPLOY_SECRET=')) {
            $secret = trim(substr($line, strlen('DEPLOY_SECRET=')));
            break;
        }
    }
}

if ($secret === null || $secret === '') {
    http_response_code(500);
    echo json_encode(['error' => 'DEPLOY_SECRET not configured in .env']);
    exit(1);
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if (!hash_equals($secret, $token)) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit(1);
}

set_time_limit(300);
header('Content-Type: application/json');

$output = [];
$hasError = false;

function runCommand(string $command, string $cwd, array &$output): bool
{
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $process = proc_open($command, $descriptors, $pipes, $cwd);

    if (!is_resource($process)) {
        $output[] = ['command' => $command, 'status' => 'error', 'message' => 'Failed to start process'];
        return false;
    }

    fclose($pipes[0]);
    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    $returnCode = proc_close($process);

    $output[] = [
        'command' => $command,
        'status' => $returnCode === 0 ? 'success' : 'error',
        'stdout' => trim($stdout),
        'stderr' => trim($stderr),
        'exit_code' => $returnCode,
    ];

    return $returnCode === 0;
}

// Step 1: Setup SSH known hosts
runCommand('mkdir -p ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 2>/dev/null', $projectPath, $output);

// Step 2: Fetch with retries
$fetchSuccess = false;
for ($i = 1; $i <= 3; $i++) {
    if (runCommand('git fetch origin build --depth 1', $projectPath, $output)) {
        $fetchSuccess = true;
        break;
    }
    if ($i < 3) {
        sleep(5);
    }
}

if (!$fetchSuccess) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'git fetch failed after 3 attempts', 'steps' => $output]);
    exit(1);
}

// Step 3: Checkout, reset, migrate, optimize
$steps = [
    'git checkout build',
    'git reset --hard origin/build',
    'git clean -fd -e .htaccess -e .env',
    'php artisan migrate --force --no-interaction',
    'php artisan optimize:clear',
];

foreach ($steps as $step) {
    if (!runCommand($step, $projectPath, $output)) {
        $hasError = true;
        break;
    }
}

http_response_code($hasError ? 500 : 200);

echo json_encode([
    'status' => $hasError ? 'error' : 'success',
    'message' => $hasError ? 'Deployment failed' : 'Deployment completed successfully',
    'timestamp' => date('Y-m-d H:i:s'),
    'steps' => $output,
], JSON_PRETTY_PRINT);
