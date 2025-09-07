<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('musicas', function (Blueprint $table) {

            $table->id();
            $table->string('titulo');
            $table->integer('visualizacoes');
            $table->text('youtube_id');
            $table->text('thumb');
            $table->unsignedBigInteger('user_id');
            $table->boolean('aprovado')->default(false);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->boolean('status')->default(true);
            $table->timestamps();

            //             titulo TEXT NOT NULL,
            // visualizacoes INTEGER NOT NULL,
            // youtube_id TEXT NOT NULL,
            // thumb TEXT NOT NULL,
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('musicas');
    }
};
