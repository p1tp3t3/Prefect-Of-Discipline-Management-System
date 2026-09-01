<?php

namespace App\Console\Commands;

use App\Models\WebPushSubscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class WebPushSubscriptionExpirationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webpush:check-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks web push subscriptions and removes expired ones';

    public function handle()
    {
        $this->info('🔍 Checking for expired Web Push subscriptions...');

        try {
            $endpoints = new WebPushSubscription();
            $list = $endpoints->select('endpoint', 'public_key', 'auth')
                    ->distinct()
                    ->get()
                    ->map(function($item) {
                        return [
                            'endpoint'   => $item->endpoint,
                            'public_key' => $item->public_key,
                            'auth'       => $item->auth,
                        ];
                    })
                    ->toArray();

            $response = Http::post(
                'http://127.0.0.1:5000/python/webpush/check-subscription-expiration',
                ['list' => $list]
            );

            if (!$response->successful()) {
                return;
            }

            $results = $response->json('results');

            // Filter expired only
            $expired = collect($results)
                ->whereIn('status', ['expired', 'invalid'])
                ->pluck('endpoint')
                ->values()
                ->toArray();
            
            $endpoints->whereIn('endpoint', $expired)->delete();

            Log::info('success deleted expired subscriptions');
        } catch (Exception $e) {
            Log::error('WebPush expiration check failed', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ]);
            $this->error('❗ An error occurred: ' . $e->getMessage());
        }

        return Command::SUCCESS;
    }
}
