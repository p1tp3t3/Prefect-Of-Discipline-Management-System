<?php

namespace App\Console\Commands;

use App\Http\Controllers\Resource\WebPushController;
use Illuminate\Console\Command;

class AvailabilityCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:availability-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if Prefect is Available';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $push = new WebPushController();
        $push->push([
            'title' => 'Hello Users',
            'body' => 'The Prefect Is Now Available For Transactions',
            'icon' => '',
            'url' => '/dashboard'
        ]);
        $this->info('available');
    }
}
