<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'customer_id_from',
        'customer_email_from',
        'customer_id_to',
        'customer_email_to',
        'account_from',
        'amount',
        'created_at',
        'updated_at'
    ];
}
