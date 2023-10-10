<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Mail\SendMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function getAllCustomers()
    {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $users = User::where('role_as', 0)->get();

            return response(['data' => $users]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

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

        Mail::to($data['email'])->send(new SendMail($mailData));

        return response(['success' => true]);
    }

    public function adminCreateAccount(Request $request)
    {
        $customer_email = $request['email'];
        $account_country_info = $request['country'];


        if (empty($customer_email) || empty($account_country_info)) {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }

        $account_country_info = explode("|", $account_country_info);

        $account_symbol = $account_country_info[0];

        $account_county = $account_country_info[1];

        $account_number = Str::random(20);

        $customer = User::where('email', $customer_email)->get()->first();

        $customer_id = $customer->id;

        $current_time = Carbon::now();

        DB::table('accounts')->insert([
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

    public function getAccounts()
    {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $accounts = DB::table('accounts')->get();

            return response(['data' => $accounts]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

    public function depositMoney(Request $request) {

        $user = Auth::user();

        if ($user->role_as === 1) {
            $account_number = $request['account'];
            $deposit_amount = $request['amount'];


            if (empty($account_number) || empty($deposit_amount)) {
                return response([
                    'error' => 'The provided credentials are not correct'
                ], 422);
            }

            $customer_account = DB::table('accounts')->where('account_number', $account_number)->first();

            $new_balance = $customer_account->balance + $deposit_amount;

            DB::table('accounts')->where('account_number', $account_number)->update(['balance' => $new_balance]);

            return response([
                'success' => true,
            ]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }

    public function getTransactions() {
        $user = Auth::user();

        if ($user->role_as === 1) {
            $transactions = DB::table('transactions')->get();

            return response(['data' => $transactions]);
        } else {
            return response([
                'error' => 'Not found'
            ], 404);
        }
    }
}
