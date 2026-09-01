<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Preview</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
    <style>
        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
            height: 100vh;
            display: grid;
            place-items: center;
            background: {{ $enabled ? 'radial-gradient(circle at top, #fff7ed, #fef2f2 60%)' : 'radial-gradient(circle at top, #eff6ff, #f8fafc 60%)' }};
            color: #1f2937;
        }

        .card {
            text-align: center;
            padding: 2.5rem 2.25rem;
            max-width: 24rem;
            width: 90%;
            background: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.15);
            border: 1px solid {{ $enabled ? '#fed7aa' : '#dbeafe' }};
        }

        .icon-wrap {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1.1rem;
            border-radius: 999px;
            display: grid;
            place-items: center;
            font-size: 1.9em;
            background: {{ $enabled ? '#ffedd5' : '#dcfce7' }};
        }

        .icon-wrap.online { background: #dcfce7; color: #16a34a; }
        .icon-wrap.maintenance { background: #ffedd5; color: #ea580c; }

        h1 {
            font-size: 1.25em;
            font-weight: 700;
            margin: 0 0 0.4em;
            color: #111827;
        }

        p {
            color: #6b7280;
            font-size: 0.9em;
            line-height: 1.5;
            margin: 0;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4em;
            margin-top: 1.1rem;
            padding: 0.3em 0.8em;
            border-radius: 999px;
            font-size: 0.75em;
            font-weight: 600;
            letter-spacing: 0.02em;
        }

        .badge.online { background: #dcfce7; color: #15803d; }
        .badge.maintenance { background: #ffedd5; color: #c2410c; }

        .dot {
            width: 0.5em;
            height: 0.5em;
            border-radius: 999px;
            background: currentColor;
        }
    </style>
</head>
<body>
    <div class="card">
        @if($enabled)
            <div class="icon-wrap maintenance"><i class="fa-solid fa-screwdriver-wrench"></i></div>
            <h1>We'll Be Right Back</h1>
            <p>The system is currently undergoing maintenance. Please check back again shortly.</p>
            <div class="badge maintenance"><span class="dot"></span> Under Maintenance</div>
        @else
            <div class="icon-wrap online"><i class="fa-solid fa-circle-check"></i></div>
            <h1>System Online</h1>
            <p>The site is accessible to everyone as normal.</p>
            <div class="badge online"><span class="dot"></span> Live</div>
        @endif
    </div>
</body>
</html>
