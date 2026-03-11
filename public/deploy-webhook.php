<?php

declare(strict_types=1);

/**
 * Deploy Webhook Script (placed in /public/ for Hostinger .htaccess compatibility)
 *
 * This is a standalone script. DO NOT use Laravel classes/Facades here as they
 * require booting the framework which is not done for this script.
 */

// --- Global Error Handler ---
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Fatal Error in webhook script',
            'error' => $error,
        ]);
        exit(1);
    }
});

// --- Security Check ---
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit(1);
}

// --- Configuration ---
$projectPath = dirname(__DIR__);
$envFile = $projectPath.'/.env';
$secret = null;

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = mb_trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (str_starts_with($line, 'DEPLOY_SECRET=')) {
            $secret = mb_trim(mb_substr($line, mb_strlen('DEPLOY_SECRET=')));
            // Handle optional quotes
            $secret = mb_trim($secret, '"\'');
            break;
        }
    }
}

if ($secret === null || $secret === '') {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'DEPLOY_SECRET not configured in .env']);
    exit(1);
}

// --- Authorization Check ---
$token = $_SERVER['HTTP_X_DEPLOY_TOKEN'] ?? '';

if (! hash_equals($secret, $token)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unauthorized']);
    exit(1);
}

// --- Requirements Check ---
$requiredFunctions = ['proc_open'];
$disabledFunctions = explode(',', ini_get('disable_functions') ?: '');
$missing = [];

foreach ($requiredFunctions as $func) {
    if (! function_exists($func) || in_array($func, array_map('trim', $disabledFunctions))) {
        $missing[] = $func;
    }
}

if (! empty($missing)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Required PHP functions are disabled on this server',
        'missing' => $missing,
    ]);
    exit(1);
}

// --- Execution ---
set_time_limit(300);
header('Content-Type: application/json');

$outputArr = [];
$hasError = false;

function runCommand(string $command, string $cwd, array &$outputArr): bool
{
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $process = proc_open($command, $descriptors, $pipes, $cwd);

    if (! is_resource($process)) {
        $outputArr[] = ['command' => $command, 'status' => 'error', 'message' => 'Failed to start process'];

        return false;
    }

    fclose($pipes[0]);
    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    $returnCode = proc_close($process);

    $outputArr[] = [
        'command' => $command,
        'status' => $returnCode === 0 ? 'success' : 'error',
        'stdout' => mb_trim($stdout),
        'stderr' => mb_trim($stderr),
        'exit_code' => $returnCode,
    ];

    return $returnCode === 0;
}

// Commands to run
$steps = [
    // Step 1: Ensure known_hosts is set for GitHub
    'mkdir -p ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 2>/dev/null',

    // Step 2: Git updates
    'git fetch origin build --depth 1',
    'git checkout build',
    'git reset --hard origin/build',
    'git clean -fd -e .htaccess -e .env',

    // Step 3: Composer and Laravel
    'composer install --no-interaction --no-dev --prefer-dist',
    'php artisan migrate --force --no-interaction',
    'php artisan optimize:clear',
];

foreach ($steps as $step) {
    if (! runCommand($step, $projectPath, $outputArr)) {
        $hasError = true;
        // If it's a critical git error, stop.
        // Note: some git-clean or mkdir might fail but we might want to continue.
        // But generally, deployment steps are sequential.
        break;
    }
}

$statusCode = $hasError ? 500 : 200;
http_response_code($statusCode);

echo json_encode([
    'status' => $hasError ? 'error' : 'success',
    'message' => $hasError ? 'Deployment failed' : 'Deployment completed successfully',
    'timestamp' => date('Y-m-d H:i:s'),
    'steps' => $outputArr,
], JSON_PRETTY_PRINT);
