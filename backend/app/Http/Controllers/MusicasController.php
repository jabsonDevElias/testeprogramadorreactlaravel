<?php

namespace App\Http\Controllers;
use App\Models\Musicas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MusicasController extends Controller
{
    public function listarMusicas(Request $request, $idMusica = null)
    {

        try {
            $query = Musicas::query();

            if ($idMusica) {
                $query->where('id', $idMusica);
            }

            $musicas = $query->get();

            return response()->json($musicas, 200);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function cadastraMusicas(Request $request)
    {
        try {

            $ordem = Musicas::create([
                'titulo' => $request->input('titulo'),
                'visualizacoes' => $request->input('visualizacoes'),
                'youtube_id' => $request->input('youtube_id'),
                'thumb' => $request->input('thumb'),
                'user_id' => $request->input('user_id')
            ]);


            if ($ordem) {
                return response()->json(['message' => 'Musica Registrada'], 200);
            } else {
                return response()->json(['message' => 'ERRO ao tentar registrar a Musica!'], 400);
            }

        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

    }

    public function atualizaMusicas(Request $request, $idMusica)
    {
        try {

            $usuario = Musicas::findOrFail($idMusica);

            $usuario->titulo = $request->input('titulo');
            $usuario->visualizacoes = $request->input('visualizacoes');
            $usuario->youtube_id = $request->input('youtube_id');
            $usuario->thumb = $request->input('thumb');
            $usuario->user_id = $request->input('user_id');

            $usuario->save();

            return response()->json(['message' => 'Musica atualizada com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar musica: ' . $e->getMessage()], 500);
        }
    }

    public function deletaMusicas(Request $request, $idMusica)
    {
        try {

            $usuario = Musicas::findOrFail($idMusica);

            $usuario->status = false;

            $usuario->save();

            return response()->json(['message' => 'Musica deletada com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao deletar musica: ' . $e->getMessage()], 500);
        }
    }


}
