<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MusicasController;
use App\Http\Controllers\UsuariosController;
use Illuminate\Support\Facades\Route;

//ROTAS PARA LOGIN

Route::post('/login', [AuthController::class, 'login']);

Route::get('/musicas/{idMusica?}', [MusicasController::class, 'listarMusicas'])->name("idMusica");
Route::post('/cadastra-musicas', [MusicasController::class, 'cadastraMusicas']);
Route::post('/cadastra-usuarios', [UsuariosController::class, 'cadastraUsuarios']);


Route::middleware('auth:api')->group(function () {

    //ROTAS USUARIOS

    Route::post('/token-info', [UsuariosController::class, 'getIdToken']);
    Route::get('/usuarios/{idUsuario?}', [UsuariosController::class, 'listarUsuarios'])->name("idUsuario");
    Route::put('/atualiza-usuarios/{idUsuario?}', [UsuariosController::class, 'atualizaUsuario'])->name("idUsuario");

    //ROTAS MUSICAS

    Route::put('/autorizar-musicas/{idMusica?}', [MusicasController::class, 'autorizarMusicas'])->name("idMusica");
    Route::put('/atualiza-musicas/{idMusica?}', [MusicasController::class, 'atualizaMusicas'])->name("idMusica");
    Route::delete('/deletar-musicas/{idMusica?}', [MusicasController::class, 'deletaMusicas'])->name("idMusica");

});