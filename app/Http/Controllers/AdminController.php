<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Mail\SendMail;
use App\Models\Account;
use App\Models\Transactions;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // Admin function to get all users
    public function getAllCustomers()
    {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $users = User::where('role_as', 0)->paginate(5);

            return response(['data' => $users]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

    // Create user account from admin panel and sending email to the customer
    public function adminCreateUser(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role_as' => 0
        ]);

        $mailData = [
            'title' => 'Mail from Bank managment',
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password']
        ];

        try {
            Mail::to($data['email'])->send(new SendMail($mailData));
        } catch (\Throwable $th) {
            return response([
                'error' => 'Customer account created successfully but could not send an email!'
            ]);
        }

        return response(['success' => true]);
    }

    // Create bank account for the customer from the admin panel
    public function adminCreateAccount(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'country' => 'required|string'
        ]);

        $customer_email = $data['email'];
        $account_country_info = $data['country'];

        // Get the country code from the request
        $account_country_info = explode("|", $account_country_info);

        $account_symbol = $account_country_info[0];

        $account_county = $account_country_info[1];

        $account_number = Str::random(20);

        $customer = User::where('email', $customer_email)->get()->first();

        $customer_id = $customer->id;

        $current_time = Carbon::now();

        Account::create([
            'email' => $customer_email,
            'customer_id' => $customer_id,
            'account_number' => $account_number,
            'account_country' => $account_county,
            'account_symbol' => $account_symbol,
            'balance' => 0,
            'created_at' => $current_time,
            'updated_at' => $current_time,
        ]);

        return response([
            'success' => true,
        ]);
    }

    // Get all bank accounts
    public function getAccounts()
    {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $accounts = Account::paginate(5);

            return response(['data' => $accounts]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

    // Deposit money in the bank account from admin
    public function depositMoney(Request $request) {

        $data = $request->validate([
            'account' => 'required|string',
            'amount' => 'required|integer'
        ]);

        $user = Auth::user();

        if ($user->role_as === 1) {
            $account_number = $data['account'];
            $deposit_amount = $data['amount'];

            $customer_account = Account::where('account_number', $account_number)->first();

            $new_balance = $customer_account->balance + $deposit_amount;

            Account::where('account_number', $account_number)->update(['balance' => $new_balance]);

            return response([
                'success' => true,
            ]);

        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

    // Get all transactions
    public function getTransactions() {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $transactions = Transactions::paginate(5);

            return response(['data' => $transactions]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }
}
