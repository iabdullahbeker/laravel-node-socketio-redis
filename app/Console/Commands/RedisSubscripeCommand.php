<?php

namespace App\Console\Commands;

use App\Events\SendMessageEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisSubscripeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'redis:sub';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        ini_set('default_socket_timeout', -1);

        $events = [
            'send-test-from-js',
        ];

        $this->line('<fg=green>listening to redis ...</>');

        Redis::connection()->subscribe($events,function($message,$channel){

            $this->line("<fg=green>receiving .....</>");
            $this->line(json_encode([$message]));
            if($channel == "redis-app-send-test-from-js"){
                event(new SendMessageEvent($message));
            }
        });
    }
}
