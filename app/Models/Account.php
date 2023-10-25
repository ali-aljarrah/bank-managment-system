<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'customer_id',
        'account_number',
        'account_country',
        'account_symbol',
        'balance',
        'created_at',
        'updated_at'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }
}
