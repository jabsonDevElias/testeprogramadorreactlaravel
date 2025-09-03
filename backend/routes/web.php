<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicasController;
use Illuminate\Support\Facades\Route;

//ROTAS PARA LOGIN

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/musicas/{idMusica?}', [MusicasController::class, 'listarMusicas'])->name("idMusica");
    Route::post('/cadastra-musicas', [MusicasController::class, 'cadastraMusicas']);
    Route::put('/atualiza-musicas/{idMusica?}', [MusicasController::class, 'atualizaMusicas'])->name("idMusica");
    Route::delete('/deletar-musicas/{idMusica?}', [MusicasController::class, 'deletaMusicas'])->name("idMusica");
});