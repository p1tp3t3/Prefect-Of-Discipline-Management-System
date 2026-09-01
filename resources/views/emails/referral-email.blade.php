<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Guidance Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .notification-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.6;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="notification-container">
        <div class="header">
            <h1>Referral Guidance Notification</h1>
        </div>
        <div class="content">
            <p>Dear Guidance Office,</p>
            <p>A referral has been sent for your review. Please find the referral document(s) attached below:</p>
            <ul>
                <li><strong>Referred By:</strong> {{ $prefect_name }}</li>
                <li><strong>Student(s):</strong> {{ $student_names }}</li>
                <li><strong>Date Issued:</strong> {{ $date_issued }}</li>
            </ul>
        </div>
        <div class="footer">
            <p>This is an automated notification from POD Management System. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
