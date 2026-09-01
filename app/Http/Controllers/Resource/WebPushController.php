<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WebPushSubscription;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Attribute\Cache;

class WebPushController extends Controller
{
    private $id;

    public function store(Request $request) {
        $user = auth()->user();

        if(auth()->check()) {
            WebPushSubscription::updateOrInsert(
                            ['endpoint' => $request->endpoint], [
                            'user_id' => $user->id,
                            'endpoint' => $request->endpoint,
                            'public_key' => $request->public_key,
                            'auth' => $request->auth,
                        ]);
        }
        session(['webpush_endpoint' => $request->endpoint]);

        return response()->json(['status' => 'subscription saved']);
    }
    public function push($payload) {
        $data = [
            'title' => $payload['title'],
            'body' => $payload['body'],
            'icon' => ($payload['icon'] == '' || $payload['icon'] == null) 
                      ? "https://lightgreen-squirrel-750001.hostingersite.com/default-pic/sys-icon.png"
                      : $payload['icon'],
            'url' => $payload['url'],
            'subscription' => self::getSubscription()
        ];
        $w = Http::withoutVerifying()->post('https://pitpete-violation-risk-predictor-api.hf.space/python/webpush', $data);
        
        $response = $w->json()['errors']; // this is the array you showed

foreach ($response as $e) {

    if (
        ($e['status'] ?? null) !== 'success'
        && str_contains($e['message'] ?? '', 'push subscription has unsubscribed or expired')
    ) {
        WebPushSubscription::where('endpoint', $e['endpoint'])->delete();
    }
}

    }
    private function getSubscription() {
        return WebPushSubscription::where('user_id', self::getId())->get();
    }
    public function  setId($id) {
        $this->id = $id;
    }
    public function getId() {
        return $this->id;
    }
}
