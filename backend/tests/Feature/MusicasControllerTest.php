<?php

namespace Tests\Feature;

use App\Models\Musicas;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MusicasControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();

        // cria usuário válido
        $this->user = User::factory()->create();
    }

    /** @test */
    public function listar_musicas_retorna_paginate()
    {
        Musicas::factory()->count(7)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/musicas');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'links', 'meta']);
    }

    /** @test */
    public function cadastra_musicas_cria_musica()
    {
        // mock do método getVideoInfo para não chamar o YouTube
        $this->partialMock(\App\Http\Controllers\MusicasController::class, function ($mock) {
            $mock->shouldReceive('getVideoInfo')->andReturn([
                'titulo' => 'Fake Video',
                'visualizacoes' => 123,
                'youtube_id' => 'abcd1234',
                'thumb' => 'https://fake/thumb.jpg'
            ]);
        });

        $payload = [
            'youtube_id' => 'abcd1234',
        ];

        $response = $this->postJson('/cadastra-musicas', $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Musica Registrada']);

        $this->assertDatabaseHas('musicas', [
            'titulo' => 'Fake Video',
            'youtube_id' => 'abcd1234',
            'status' => true,
        ]);
    }

    /** @test */
    public function autorizar_musicas_altera_aprovado_para_true()
    {
        $musica = Musicas::factory()->create(['user_id' => $this->user->id, 'aprovado' => false]);

        $response = $this->putJson("/autorizar-musicas/{$musica->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Musica autorizada com sucesso.']);

        $this->assertDatabaseHas('musicas', [
            'id' => $musica->id,
            'aprovado' => true,
        ]);
    }

    /** @test */
    public function atualiza_musicas_atualiza_os_dados()
    {
        $musica = Musicas::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'titulo' => 'Novo Título',
            'visualizacoes' => 9999,
        ];

        $response = $this->putJson("/atualiza-musicas/{$musica->id}", $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Musica atualizada com sucesso.']);

        $this->assertDatabaseHas('musicas', [
            'id' => $musica->id,
            'titulo' => 'Novo Título',
            'visualizacoes' => 9999,
        ]);
    }

    /** @test */
    public function deleta_musicas_altera_status_para_false()
    {
        $musica = Musicas::factory()->create(['user_id' => $this->user->id, 'status' => true]);

        $response = $this->deleteJson("/deletar-musicas/{$musica->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Musica deletada com sucesso.']);

        $this->assertDatabaseHas('musicas', [
            'id' => $musica->id,
            'status' => false,
        ]);
    }
}
