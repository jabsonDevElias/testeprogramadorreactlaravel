<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsuariosController extends Controller
{

    public function getIdToken()
    {
        try {
            // Pega o usuário autenticado pelo token
            $user = JWTAuth::parseToken()->authenticate();

            if ($user) {

                $query = User::query();

                if ($user->id) {
                    $query->where('id', $user->id);
                }

                $usuario = $query->select('id', 'name', 'email')->first();

                return response()->json($usuario, 200);
            }

            return response()->json(['valid' => false], 401);

        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expirado'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token ausente'], 401);
        }
    }
    public function listarUsuarios(Request $request, $idUsuario = null)
    {

        try {

            $query = User::query();

            if ($idUsuario) {
                $query->where('id', $idUsuario);
            }

            $usuario = $query->get();

            return response()->json($usuario, 200);

        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function cadastraUsuarios(Request $request)
    {
        try {

            $ordem = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password'))
            ]);

            if ($ordem) {
                return response()->json(['message' => 'Usuário Registrado'], 200);
            } else {
                return response()->json(['message' => 'ERRO ao tentar registrar o Usuário'], 400);
            }

        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

    }

    public function atualizaUsuario(Request $request, $idUsuario)
    {
        try {
            $usuario = User::findOrFail($idUsuario);

            $usuario->name = $request->input('name');
            $usuario->email = $request->input('email');
            $usuario->password = bcrypt($request->input('password'));

            $usuario->save();

            return response()->json(['message' => 'Usuário atualizado com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar Usuário: ' . $e->getMessage()], 500);
        }
    }
}
