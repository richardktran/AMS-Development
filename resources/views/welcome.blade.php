<?php ?>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Asset Management System</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link href="{{ mix('/css/app.css') }}" rel="stylesheet">
    </head>
    <body class="antialiased">
        <div id="root"></div>
        <script src="{{ mix('/js/manifest.js') }}"></script>
        <script src="{{ mix('/js/vendor.js') }}"></script>
        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
