<?php

namespace App\Http\Controllers;
use App\Models\Musicas;
use Exception;
use Illuminate\Http\Request;

class MusicasController extends Controller
{


    public function getVideoInfo($videoId)
    {
        $url = "https://www.youtube.com/watch?v=" . $videoId;

        // Inicializa o cURL
        $ch = curl_init();

        // Configura o cURL para a requisição
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ]);

        // Faz a requisição
        $response = curl_exec($ch);

        if ($response === false) {
            throw new Exception("Erro ao acessar o YouTube: " . curl_error($ch));
        }

        curl_close($ch);

        // Extrai o título
        if (!preg_match('/<title>(.+?) - YouTube<\/title>/', $response, $titleMatches)) {
            throw new Exception("Não foi possível encontrar o título do vídeo");
        }
        $title = html_entity_decode($titleMatches[1], ENT_QUOTES);

        // Extrai as visualizações
        // Procura pelo padrão de visualizações no JSON dos dados do vídeo
        if (preg_match('/"viewCount":\s*"(\d+)"/', $response, $viewMatches)) {
            $views = (int) $viewMatches[1];
        } else {
            // Tenta um padrão alternativo
            if (preg_match('/\"viewCount\"\s*:\s*{.*?\"simpleText\"\s*:\s*\"([\d,\.]+)\"/', $response, $viewMatches)) {
                $views = (int) str_replace(['.', ','], '', $viewMatches[1]);
            } else {
                $views = 0;
            }
        }

        if ($title === '') {
            throw new Exception("Vídeo não encontrado ou indisponível");
        }

        return [
            'titulo' => $title,
            'visualizacoes' => $views,
            'youtube_id' => $videoId,
            'thumb' => 'https://img.youtube.com/vi/' . $videoId . '/hqdefault.jpg'
        ];
    }
    public function listarMusicas(Request $request, $idMusica = null)
    {

        try {
            $query = Musicas::query();

            $query->where('status',true);

            if ($idMusica) {
                $query->where('id', $idMusica);
            }

            if ($request->has('aprovado')) {
                $query->where('aprovado', $request->input('aprovado'));
            }

            
           $musicas = $query->paginate(5);

            return response()->json($musicas, 200);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function cadastraMusicas(Request $request)
    {
        $video = $this->getVideoInfo($request->input('youtube_id'));

        try {

            $ordem = Musicas::create([
                'titulo' => $video['titulo'],
                'visualizacoes' => $video['visualizacoes'],
                'youtube_id' => $request->input('youtube_id'),
                'thumb' => $video['thumb'],
                'user_id' => 1
                // 'user_id' => $request->input('user_id')
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

    public function autorizarMusicas(Request $request, $idMusica)
    {
        try {

            $usuario = Musicas::findOrFail($idMusica);
            $usuario->aprovado = true;

            $usuario->save();

            return response()->json(['message' => 'Musica autorizada com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao autorizar musica: ' . $e->getMessage()], 500);
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
