<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    
    protected $fillable = ['name','slug'];

    /**
     * A Category has many Ebooks.
     */
    public function ebooks()
    {
        return $this->hasMany(Ebook::class);
    }
}
