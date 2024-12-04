@component('mail::message')
    # Post Updated: {{ $post->title }}

    The following changes have been made to the post:

    @foreach($changes as $field => $change)
        - **{{ ucfirst($field) }}** has been updated
    @endforeach

    @component('mail::button', ['url' => $url])
        View Updated Post
    @endcomponent

    Best regards,<br>
    {{ config('app.name') }}

    @component('mail::subcopy')
        You're receiving this email because you're subscribed to post updates.
        [Unsubscribe]({{ $unsubscribeUrl }})
    @endcomponent
@endcomponent
