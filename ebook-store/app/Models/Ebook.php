<?php

namespace App\Models;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ebook extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'title',
        'author',
        'description',
        'subjects',
        'price',
        'cover_image',
        'file_path',
        'category_id',
    ];

    /** 
     * Cast the JSON column back to an array when reading, 
     * and to JSON when writing. 
     */
    protected $casts = [
        'subjects' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
