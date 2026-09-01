<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral to Guidance Office</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            position: relative;
        }
        .form-container {
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }
        .form-header,
        .form-section,
        .footer {
            position: relative;
            z-index: 10;
        }
        .form-header h1 {
            margin: 0;
            color: #333;
        }
        .form-section {
            margin-bottom: 20px;
        }
        .form-section h2 {
            border-bottom: 2px solid #007bff;
            padding-bottom: 5px;
            color: #007bff;
        }
        .info-group {
            margin-bottom: 15px;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 200px;
        }
        .info-value {
            display: inline-block;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="form-header" style="text-align: center;">
            <h1>Referral to Guidance Office</h1>
        </div>

        <div class="form-section">
            <h2>Student Information</h2>
            <div class="info-group">
                <span class="info-label">Student Name:</span>
                <span class="info-value">{{ $referred_student_name }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Student ID:</span>
                <span class="info-value">{{ $referred_student_id }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Program:</span>
                <span class="info-value">{{ $program }}</span>
            </div>
        </div>

        <div class="form-section">
            <h2>Referral Details</h2>
            <div class="info-group">
                <span class="info-label">Reason:</span>
                <span class="info-value">{{ $referral_reason }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Referred By:</span>
                <span class="info-value">{{ $prefect_name }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Date Issued:</span>
                <span class="info-value">{{ $date_issued }}</span>
            </div>
        </div>

        <div class="footer">
            <p>From the Office of the Prefect of the Higher Education Department of the Pilar College Of Zamboanga City.</p>
        </div>
    </div>
</body>
</html>
