<?php

namespace App\Http\Resources\V1\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProjectCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'data' => ProjectResource::collection($this->collection),
            'meta' => [
                'count' => $this->collection->count(),
            ],
        ];
    }
}
