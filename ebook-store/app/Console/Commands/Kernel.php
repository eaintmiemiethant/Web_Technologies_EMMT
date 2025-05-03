<?php

namespace App\Console;

use App\Console\Commands\ImportGutendexBooks;    
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        ImportGutendexBooks::class,                
    ];

    protected function schedule(Schedule $schedule): void
    {
        // optional: schedule the import automatically
        // $schedule->command('import:gutenberg')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
