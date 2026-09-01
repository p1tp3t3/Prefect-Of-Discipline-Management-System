<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absence Form Approval Notification</title>
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
        .attachment {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 10px;
            margin: 20px 0;
            display: flex;
            align-items: center;
        }
        .attachment-icon {
            font-size: 24px;
            margin-right: 10px;
            color: #dc3545;
        }
        .attachment-details {
            flex-grow: 1;
        }
        .attachment-details h4 {
            margin: 0;
            font-size: 16px;
        }
        .attachment-details p {
            margin: 5px 0 0 0;
            color: #6c757d;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        .button {
            display: inline-block;
            background-color: #28a745;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
        .button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="notification-container">
        <div class="header">
            <h1>Absence Form Approval Notification</h1>
        </div>
        <div class="content">
            <p>Dear {{ $student_name }},</p>
            <p>Your absence form has been reviewed and approved. Please find the details below:</p>
            <ul>
                <li><strong>Absence Dates:</strong> {{ $date_from }} to {{ $date_to }}</li>
                <li><strong>Reason:</strong> {{ $reason }}</li>
                <li><strong>Approved By:</strong> {{ $prefect_name }}</li>
                <li><strong>Approval Date:</strong> {{ $confirmed_at }}</li>
            </ul>
        </div>
        <div class="footer">
            <p>This is an automated notification from POD Management System. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
