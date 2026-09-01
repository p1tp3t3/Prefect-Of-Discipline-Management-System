<?php

namespace App\Console\Commands;

use App\Models\Complaint;
use App\Models\Referral;
use Illuminate\Console\Command;

class ArchiveExpirationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:archive-expiration-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Complaints and Referrals will be Expired Within 5 Years';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Complaint::where('archive_at', '<', now())->delete();
        Referral::where('archive_at', '<', now())->delete();
    }
}
