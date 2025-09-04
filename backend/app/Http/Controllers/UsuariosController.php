<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsuariosController extends Controller
{
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
