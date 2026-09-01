<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Notification</title>
    <style>
        /* Inline styles for email compatibility */
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .header img { max-width: 150px; height: auto; }
        .content { padding: 20px; color: #333333; line-height: 1.6; }
        .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
        .reminders { margin-top: 20px; }
        .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666666; }
        .button { display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        .button:hover { background-color: #0056b3; }
        ul { padding-left: 20px; }
        @media only screen and (max-width: 600px) {
            .container { width: 100%; }
            .header, .content, .footer { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Appointment Scheduled</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Dear {{ $parent_name }},</p>
            <p>We are writing to confirm that an appointment has been scheduled for your student, {{ $student_name }}, regarding their concern about their record of incidents and violations.</p>
            
            <div class="details">
                <h3>Appointment Details:</h3>
                <ul>
                    <li><strong>Date:</strong>{{ $appointment_date }}</li>
                    <li><strong>Time:</strong>{{ $appointment_time }}</li>
                    <li><strong>Purpose:</strong>Discussion of student's record of incidents and violations</li>
                    <li><strong>Provider:</strong>{{ $prefect_name }}</li>
                </ul>
            </div>
            
            <p>If you need to reschedule or have any questions, please contact us at {{ $contact_number }} or reply to this email.</p>
            
            <p>Thank you for your attention to this matter. We look forward to supporting {{ $student_name }}!</p>
            
        </div>
    </div>
</body>
</html>