<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsuariosControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Cria um usuário de teste
        $this->user = User::factory()->create([
            'name' => 'Teste',
            'email' => 'teste@email.com',
            'password' => bcrypt('senha123'),
        ]);

        // Gera token JWT
        $this->token = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function test_get_id_token_retorna_usuario_autenticado()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson('/token-info'); // rota correta

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $this->user->id,
                     'name' => $this->user->name,
                     'email' => $this->user->email,
                 ]);
    }

    /** @test */
    public function test_listar_usuarios_retorna_todos_usuarios()
    {
        $usuario2 = User::factory()->create([
            'name' => 'Outro Usuário',
            'email' => 'outro@email.com',
            'password' => bcrypt('senha123')
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->getJson('/usuarios'); // rota correta

        $response->assertStatus(200)
                 ->assertJsonCount(2) // usuário do setUp + usuario2
                 ->assertJsonFragment(['email' => $this->user->email])
                 ->assertJsonFragment(['email' => $usuario2->email]);
    }

    /** @test */
    public function test_cadastra_usuarios_cria_um_novo_usuario()
    {
        $dados = [
            'name' => 'Maria',
            'email' => 'maria@email.com',
            'password' => 'senha123'
        ];

        $response = $this->postJson('/cadastra-usuarios', $dados);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Usuário Registrado']);

        $this->assertDatabaseHas('users', [
            'email' => 'maria@email.com',
        ]);
    }

    /** @test */
    public function test_atualiza_usuario_atualiza_os_dados()
    {
        $dadosAtualizados = [
            'name' => 'João Atualizado',
            'email' => 'joaoatualizado@email.com',
            'password' => 'novasenha'
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->putJson("/atualiza-usuarios/{$this->user->id}", $dadosAtualizados);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Usuário atualizado com sucesso.']);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'João Atualizado',
            'email' => 'joaoatualizado@email.com',
        ]);
    }
}
