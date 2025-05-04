<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CartItem extends Model
{
    protected $fillable = ['user_id','ebook_id','quantity'];

    public function ebook() { return $this->belongsTo(Ebook::class); }
    public function user()  { return $this->belongsTo(User::class); }
}
