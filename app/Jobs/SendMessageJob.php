<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class SendMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    private $message;
    private $socketId;
    public function __construct($message)
    {
        info('job constructor');
        $this->message = $message;
        $this->socketId = json_decode($message,true)['socket_id'];
        $this->body = json_decode($message,true)['body'];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // info($this->socketId);
        // sleep(5);
        Redis::connection()->publish("send-message-to-client", json_encode([
            "socketId" => $this->socketId,
            "body" => $this->body
        ]));
    }
}
