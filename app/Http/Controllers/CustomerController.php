<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transactions;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    // Get the logged customer bank accounts
    public function getCustomerAccounts() {
        $user = Auth::user();

        $user_id = $user->id;
        
        $customer_accounts = Account::where('customer_id', $user_id)->paginate(5);

        return response([
            'accounts' => $customer_accounts
        ]);
    }

    // Get another customers account for transfer
    public function getAnotherCustomerAccounts() {
        $user = Auth::user();

        $user_id = $user->id;
        
        $customer_accounts = Account::where('customer_id', '!=' , $user_id)->get();

        return response([
            'accounts' => $customer_accounts
        ]); 
    }

    // Customer transfer money to another bank account
    public function customerTransfer(Request $request) {
        $data = $request->validate([
            'accountFrom' => 'required|string',
            'accountTo' => 'required|string',
            'amount' => 'required|integer'
        ]);

        $account_from_id = $data['accountFrom']; 
        $account_to_id = $data['accountTo']; 
        $amount = $data['amount']; 

        $account_from = Account::where('id' , $account_from_id)->first();
        $account_to = Account::where('id' , $account_to_id)->first();

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

        Account::where('id', $account_from_id)->update(['balance' => $account_from_new_balance]);
        Account::where('id', $account_to_id)->update(['balance' => $account_to_new_balance]);

        $current_time = Carbon::now();

        Transactions::insert([
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

        $customer_transactions = Transactions::where('customer_id_from', $user->id)->orWhere('customer_id_to', $user->id)->paginate(5);

        return response([
            'transactions' => $customer_transactions
        ]);
    }
}
