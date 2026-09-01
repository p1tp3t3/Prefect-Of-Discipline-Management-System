<?php
    
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('complaint.{user_id}.send', function () {
    return true;
});
Broadcast::channel('complaint.confirmation.{user_id}', function () {
    return true;
});
Broadcast::channel('referral.{user_id}.send', function () {
    return true;
});
Broadcast::channel('referral.confirmation.{user_id}', function () {
    return true;
});
Broadcast::channel('absent-form.{user_id}.send', function() {
    return true;
});
Broadcast::channel('absent-form.confirmation.{user_id}', function() {
    return true;
});
Broadcast::channel('notify.{user_id}', function () {
    return true;
});
Broadcast::channel('call_in.{student_id}', function($student_id) {
    return true;
});
Broadcast::channel('notify.{type}', function($type) {
    return true;
});
Broadcast::channel('appointment.{user_id}.request', function () {
    return true;
});
Broadcast::channel('gatepass.{user_id}.send', function () {
    return true;
});
Broadcast::channel('gatepass.confirmation.{user_id}', function () {
    return true;
});
Broadcast::channel('job-status.progress.user.{user_id}', function () {
    return true;
});
Broadcast::channel('online-users', function ($user) {
    return ['id' => $user->id];
});
