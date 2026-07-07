<?php

declare(strict_types=1);

if (function_exists('pcntl_fork')) {
    passthru('php artisan pail --timeout=0');
} else {
    echo 'Pail requires pcntl extension (not supported on Windows).'.PHP_EOL;
}
