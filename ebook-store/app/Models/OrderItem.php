<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Ebook;
class OrderItem extends Model
{
    protected $fillable = ['order_id','ebook_id','quantity','unit_price'];
    protected $casts = [
        'unit_price' => 'decimal:2',
    ];
    public function ebook() { return $this->belongsTo(Ebook::class); }
    public function order() { return $this->belongsTo(Order::class); }
}
