<?php

use App\Http\Controllers\API\AssetController;
use App\Http\Controllers\API\AssignmentController;
use App\Http\Controllers\API\User\AssignmentController as MyAssignmentController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\ReturningController;
use App\Http\Controllers\API\User\ReturningController as MyReturningController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
| Route::middleware('auth:api')->get('/samples', function (Request $request) {
|     return $request->user();
| });
*/

Route::get('/samples', function () {
    // If the Content-Type and Accept headers are set to 'application/json',
    // this will return a JSON structure. This will be cleaned up later.
    return 'This is a sample response';
});

Route::post('login', [AuthController::class, 'login'])->name('login');

// TODO: REMOVE THIS, TEMP API FOR TESTING
Route::get('reset-must-change-pass', [AuthController::class, 'resetMustChangePassword']);
Route::get('restore-user/{username}', [UserController::class, 'restoreUser']);
Route::get('hook/assignment-list', function () {
    $assigns = \App\Models\Assignment::all();
    return view('assignment-list', compact('assigns'));
});

Route::middleware(['auth:api', 'role'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])
        ->middleware(['scope:admin,staff']);

    Route::patch('change-password', [AuthController::class, 'updateAuthUser'])
        ->middleware(['scope:admin,staff']);

    // TODO: CHANGE URL TO ?CONFIRM=TRUE
    Route::post('users/{user}/check-valid-assignment', [UserController::class, 'isAnyValidAssignment'])
        ->middleware(['scope:admin']);

    Route::apiResource('users', UserController::class)
        ->middleware(['scope:admin']);

    Route::get('me', [AuthController::class, 'getAuthUser'])
        ->middleware(['scope:admin,staff']);

    Route::apiResource('categories', CategoryController::class)
        ->middleware(['scope:admin']);

    Route::apiResource('assets', AssetController::class)
        ->middleware(['scope:admin']);

    Route::get('assignments/states', [AssignmentController::class, 'getStates'])
        ->middleware(['scope:admin']);

    Route::prefix('my')->group(function () {
        Route::apiResource('assignments', MyAssignmentController::class)
            ->middleware(['scope:admin,staff']);
    });

    Route::apiResource('assignments', AssignmentController::class)
        ->middleware(['scope:admin']);

    Route::post('assignments/{assignment}/return', [ReturningController::class, 'store'])
        ->middleware(['scope:admin']);

    Route::apiResource('returnings', ReturningController::class)->except(['store', 'show'])
        ->middleware(['scope:admin']);

    Route::get('returnings/states', [ReturningController::class, 'getStates'])
        ->middleware(['scope:admin']);

    Route::prefix('my')->group(function () {
        Route::post('assignments/{assignment}/return', [MyReturningController::class, 'store'])
            ->middleware(['scope:admin,staff']);
    });

    Route::get('reports', [ReportController::class, 'index'])
        ->middleware(['scope:admin']);

    Route::get('reports/export', [ReportController::class, 'export'])
        ->middleware(['scope:admin']);
});
