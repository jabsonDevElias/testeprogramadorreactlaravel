<?php

namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->userName(),
            'password' => bcrypt('senha123'),
            'status' => $this->faker->boolean(80),
        ];
    }
}