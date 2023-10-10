<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminLoginRequest;
use App\Http\Requests\AdminSignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function signup(AdminSignupRequest $request) {
        $data = $request->validated();

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role_as' => 1
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(AdminLoginRequest $request) {
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if(!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if($user->role_as === 1) {
            $token = $user->createToken('main')->plainTextToken;
    
            return response([
                'user' => $user,
                'token' => $token
            ]);
        } else {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }

    }

    public function logout(Request $request) {

        /** @var User $user */
        $user = Auth::user();

        $user->currentaccesstoken()->delete();

        return response([
            'success' => true
        ]);
    }
}
