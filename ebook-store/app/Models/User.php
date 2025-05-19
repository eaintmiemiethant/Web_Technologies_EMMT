<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\OrderItem;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function isAdmin(): bool
    {
        return $this->is_admin;
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
      /**
     * All ebooks that this user has purchased (via paid orders).
     */
    public function purchasedEbooks()
    {
        return $this->hasManyThrough(
            Ebook::class,       // final model
            OrderItem::class,   // intermediate pivot
            'order_id',         // OrderItem -> order primary key
            'id',               // Ebook -> id
            'id',               // User -> id (local key)
            'ebook_id'          // OrderItem -> ebook_id (second local key)
        )->whereHas('order', function($q) {
            $q->where('user_id', $this->id)
              ->where('status', 'paid');
        });
    }
}
