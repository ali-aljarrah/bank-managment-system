<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function getCustomerAccounts() {
        $user = Auth::user();

        $user_id = $user->id;
        
        $customer_accounts = DB::table('accounts')->where('customer_id', $user_id)->get();

        return response([
            'accounts' => $customer_accounts
        ]);
    }

    public function getAnotherCustomerAccounts() {
        $user = Auth::user();

        $user_id = $user->id;
        
        $customer_accounts = DB::table('accounts')->where('customer_id', '!=' , $user_id)->get();

        return response([
            'accounts' => $customer_accounts
        ]); 
    }

    public function customerTransfer(Request $request) {
        $account_from_id = $request['accountFrom']; 
        $account_to_id = $request['accountTo']; 
        $amount = $request['amount']; 

        if (empty($account_from_id) || empty($account_to_id) || empty($amount)) {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }

        $account_from = DB::table('accounts')->where('id' , $account_from_id)->first();
        $account_to = DB::table('accounts')->where('id' , $account_to_id)->first();

        if($account_from->account_country !== $account_to->account_country) {
            return response([
                'error' => 'Accounts must be in the same country'
            ], 422);
        }

        if($account_from->balance < $amount) {
            return response([
                'error' => 'The transfer amount is bigger than your balance'
            ], 422);
        }

        $account_from_new_balance = $account_from->balance - $amount;
        $account_to_new_balance = $account_to->balance + $amount;

        DB::table('accounts')->where('id', $account_from_id)->update(['balance' => $account_from_new_balance]);
        DB::table('accounts')->where('id', $account_to_id)->update(['balance' => $account_to_new_balance]);

        $current_time = Carbon::now();

        DB::table('transactions')->insert([
            'customer_id_from' => $account_from->customer_id,
            'customer_email_from' => $account_from->email,
            'customer_id_to' => $account_to->customer_id,
            'customer_email_to' => $account_to->email,
            'account_from' => $account_from->account_number,
            'account_to' => $account_to->account_number,
            'amount' => $amount,
            'created_at' => $current_time,
            'updated_at' => $current_time,
        ]);

        return response([
            'success' => true,
        ]);
    }

    public function getCustomerTransactions() {
        $user = Auth::user();

        $customer_transactions = DB::table('transactions')->where('customer_id_from', $user->id)->orWhere('customer_id_to', $user->id)->get();

        return response([
            'transactions' => $customer_transactions
        ]);
    }
}
