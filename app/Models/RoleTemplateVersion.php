<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleTemplateVersion extends Model
{
    protected $fillable = [
        'role_template_id',
        'version',
        'data',
        'changelog',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function template()
    {
        return $this->belongsTo(RoleTemplate::class, 'role_template_id');
    }
}
