<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{

    public function uploadFile(UploadedFile $file, string $storagePath, string $disk = 'public'): array
    {
        return [
            'path' => $file->store($storagePath, $disk),
            'original_name' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
        ];
    }

    public function uploadFileWithPrefix(UploadedFile $file, string $storagePath, string $prefix = '', string $disk = 'public'): array
    {
        $metadata = $this->uploadFile($file, $storagePath, $disk);
        
        if (empty($prefix)) {
            return $metadata;
        }

        return [
            $prefix . 'path' => $metadata['path'],
            $prefix . 'original_name' => $metadata['original_name'],
            $prefix . 'mime' => $metadata['mime'],
            $prefix . 'size' => $metadata['size'],
        ];
    }

    public function deleteFile(?string $filePath, string $disk = 'public'): bool
    {
        if (empty($filePath)) {
            return false;
        }

        return Storage::disk($disk)->delete($filePath);
    }


    public function replaceFile(UploadedFile $newFile, ?string $oldFilePath, string $storagePath, string $disk = 'public'): array
    {
        $this->deleteFile($oldFilePath, $disk);
        return $this->uploadFile($newFile, $storagePath, $disk);
    }

    public function replaceFileWithPrefix(UploadedFile $newFile, ?string $oldFilePath, string $storagePath, string $prefix = '', string $disk = 'public'): array
    {
        $this->deleteFile($oldFilePath, $disk);
        return $this->uploadFileWithPrefix($newFile, $storagePath, $prefix, $disk);
    }
}
