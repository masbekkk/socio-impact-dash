<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\ProjectDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

final class ProcessProjectDocumentUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        private readonly int $documentId,
        private readonly string $finalDirectory,
        private readonly string $disk = 'public',
    ) {}

    public function handle(): void
    {
        $document = ProjectDocument::find($this->documentId);

        if (! $document || ! $document->temp_path) {
            Log::warning("ProcessProjectDocumentUpload: Document #{$this->documentId} not found or no temp_path.");

            return;
        }

        $document->update(['upload_status' => 'processing']);

        try {
            $tempDisk = Storage::disk('local');
            $finalDisk = Storage::disk($this->disk);

            if (! $tempDisk->exists($document->temp_path)) {
                Log::error("ProcessProjectDocumentUpload: Temp file not found at {$document->temp_path}");
                $document->update(['upload_status' => 'failed']);

                return;
            }

            $fileName = basename($document->temp_path);
            $finalPath = $this->finalDirectory.'/'.$fileName;

            $stream = $tempDisk->readStream($document->temp_path);
            $finalDisk->put($finalPath, $stream);

            if (is_resource($stream)) {
                fclose($stream);
            }

            $document->update([
                'path' => $finalPath,
                'upload_status' => 'completed',
                'temp_path' => null,
            ]);

            $tempDisk->delete($document->temp_path);

            Log::info("ProcessProjectDocumentUpload: Document #{$this->documentId} uploaded successfully to {$finalPath}");
        } catch (\Throwable $e) {
            Log::error("ProcessProjectDocumentUpload: Failed for document #{$this->documentId}: {$e->getMessage()}");
            $document->update(['upload_status' => 'failed']);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $document = ProjectDocument::find($this->documentId);
        $document?->update(['upload_status' => 'failed']);

        Log::error("ProcessProjectDocumentUpload: Permanently failed for document #{$this->documentId}: {$exception->getMessage()}");
    }
}
