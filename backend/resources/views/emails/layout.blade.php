<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>@yield('titre', 'KASEWA.DZ')</title>
  <style>
    body { margin:0; padding:0; background:#FAF6EF; font-family: 'Segoe UI', Arial, sans-serif; color:#333; }
    .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.08); }
    .header { background:#1B4D3E; padding:28px 32px; text-align:center; }
    .header h1 { margin:0; color:#C9924A; font-size:26px; font-weight:700; letter-spacing:1px; }
    .header p { margin:4px 0 0; color:#fff; font-size:13px; opacity:0.8; }
    .body { padding:32px; }
    .greeting { font-size:18px; font-weight:600; color:#1B4D3E; margin-bottom:16px; }
    .content { font-size:15px; line-height:1.7; color:#444; }
    .card { background:#FAF6EF; border-radius:12px; padding:20px 24px; margin:20px 0; border-left:4px solid #C9924A; }
    .card p { margin:6px 0; font-size:14px; color:#555; }
    .card strong { color:#1B4D3E; }
    .btn { display:inline-block; background:#1B4D3E; color:#fff !important; text-decoration:none; padding:12px 28px; border-radius:50px; font-size:14px; font-weight:600; margin:20px 0; }
    .btn-gold { background:#C9924A; }
    .divider { border:none; border-top:1px solid #eee; margin:24px 0; }
    .footer { background:#f5f0e8; padding:20px 32px; text-align:center; }
    .footer p { margin:4px 0; font-size:12px; color:#888; }
    .footer a { color:#1B4D3E; text-decoration:none; }
    .badge { display:inline-block; background:#1B4D3E; color:#fff; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge-gold { background:#C9924A; }
    .badge-red { background:#e53e3e; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>KASEWA.DZ</h1>
      <p>Plateforme de location de tenues traditionnelles algériennes</p>
    </div>
    <div class="body">
      @yield('contenu')
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} KASEWA.DZ — Tlemcen, Algérie</p>
      <p>Vous recevez cet email car vous êtes inscrit sur <a href="http://localhost:5173">kasewa.dz</a></p>
      <p style="margin-top:8px; color:#aaa;">Ne pas répondre directement à cet email — <a href="mailto:contact@kasewa.dz">contact@kasewa.dz</a></p>
    </div>
  </div>
</body>
</html>
