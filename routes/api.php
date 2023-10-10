<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getUsers', [AdminController::class, 'getAllCustomers']);
    Route::post('/AdminCreateUser', [AdminController::class, 'adminCreateUser']);
    Route::post('/AdminCreateAccount', [AdminController::class, 'adminCreateAccount']);
    Route::get('/getAccounts', [AdminController::class, 'getAccounts']);
    Route::post('/AdminDeposit', [AdminController::class, 'depositMoney']);
    Route::get('/getTransactions', [AdminController::class, 'getTransactions']);
    Route::get('/getCustomerAccounts', [CustomerController::class, 'getCustomerAccounts']);
    Route::get('/getAnotherCustomerAccounts', [CustomerController::class, 'getAnotherCustomerAccounts']);
    Route::post('/customerTransfer', [CustomerController::class, 'customerTransfer']);
    Route::get('/getCustomerTransactions', [CustomerController::class, 'getCustomerTransactions']);
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/AdminSignup', [AdminAuthController::class, 'signup']);
Route::post('/AdminLogin', [AdminAuthController::class, 'login']);
