<?php

namespace App\Console\Commands;

use App\Http\Controllers\NotificationController;
use App\Models\GatePass;
use Illuminate\Console\Command;

class GatepassExpirationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:gatepass-expiration-command';
 
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'All Users Who Have Their Gate Pass Approved Will Be Deleted Based On Its Given Expiration Date';
 
    /**
     * Execute the console command.
     */
    public function handle()
    {
        #$gatepass = GatePass::with('user')->where('date_expiration', '<', now())->get();
        #$notif = new NotificationController();

        #$notif->notifySingleUser()

    }
}
