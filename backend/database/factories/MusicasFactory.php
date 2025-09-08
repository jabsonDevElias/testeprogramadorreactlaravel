<?php

namespace Database\Factories;

use App\Models\Musicas;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MusicasFactory extends Factory
{
    protected $model = Musicas::class;

    public function definition()
    {
        return [
            'titulo' => $this->faker->sentence(3),
            'visualizacoes' => $this->faker->numberBetween(100, 10000),
            'youtube_id' => $this->faker->regexify('[A-Za-z0-9]{11}'),
            'thumb' => $this->faker->imageUrl(),
            'aprovado' => false,
            'status' => true,
            'user_id' => User::factory(),
        ];
    }
}
