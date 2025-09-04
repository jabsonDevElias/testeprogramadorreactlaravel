<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicasController;
use App\Http\Controllers\UsuariosController;
use Illuminate\Support\Facades\Route;

//ROTAS PARA LOGIN

Route::post('/login', [AuthController::class, 'login']);
Route::get('/musicas/{idMusica?}', [MusicasController::class, 'listarMusicas'])->name("idMusica");


Route::middleware('auth:api')->group(function () {

    //ROTAS USUARIOS

    Route::get('/usuarios/{idUsuario?}', [UsuariosController::class, 'listarUsuarios'])->name("idUsuario");
    Route::post('/cadastra-usuarios', [UsuariosController::class, 'cadastraUsuarios']);
    Route::put('/atualiza-usuarios/{idUsuario?}', [UsuariosController::class, 'atualizaUsuario'])->name("idUsuario");

    //ROTAS MUSICAS
    Route::post('/cadastra-musicas', [MusicasController::class, 'cadastraMusicas']);
    Route::put('/atualiza-musicas/{idMusica?}', [MusicasController::class, 'atualizaMusicas'])->name("idMusica");
    Route::delete('/deletar-musicas/{idMusica?}', [MusicasController::class, 'deletaMusicas'])->name("idMusica");

});