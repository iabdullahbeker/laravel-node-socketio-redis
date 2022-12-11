<?php

namespace App\Listeners;

use App\Events\SendMessageEvent;
use App\Jobs\SendMessageJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendMessageListener
{


    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(SendMessageEvent $event)
    {
        info('message listener');
        dispatch(new SendMessageJob($event->getMessage()));
    }
}
