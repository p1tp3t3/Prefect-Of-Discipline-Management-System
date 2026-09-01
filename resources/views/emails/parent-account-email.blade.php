<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Parent Account</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #2a4365;
      color: #ffffff;
      padding: 20px;
      border-radius: 6px 6px 0 0;
      text-align: center;
    }
    .section {
      padding: 15px 0;
      border-bottom: 1px solid #e2e2e2;
      display: grid;
      gap: 10px;
    }
    .section:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: bold;
      color: #333333;
    }
    .value {
      margin-top: 5px;
      color: #555555;
    }
    .footer {
      text-align: center;
      color: #888888;
      font-size: 12px;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
        <h2>Your Parent Account</h2>
    </div>

    @foreach($parents as $parent)
        <div class="section">
            <div>
                <div class="label">Parent Name:</div>
                <div class="value">{{ $parent['name'] }}</div>
            </div>
            <div>
                <div class="label">Role:</div>
                <div class="value">{{ $parent['role'] }}</div>
            </div>
            <div>
                <div class="label">Username:</div>
                <div class="value">{{ $parent['username'] }}</div>
            </div>
            <div>
                <div class="label">Password:</div>
                <div class="value">{{ $parent['password'] }}</div>
            </div>
        </div>
    @endforeach

    <div class="footer">
      &copy; 2025 Your School Name. All rights reserved.
    </div>
  </div>
</body>
</html>
