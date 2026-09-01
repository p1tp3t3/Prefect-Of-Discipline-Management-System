<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approved Student Absence Form</title>
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

        /* Watermark Image */
    .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 450px; /* Adjust size if you want more coverage */
        height: 450px;
        transform: translate(-50%, -50%) rotate(-45deg);
        opacity: 0.30; /* slightly stronger watermark visibility */
        z-index: 999; /* Ensure watermark is above everything */
        pointer-events: none;
        user-select: none;
    }

/* Lower content layer so watermark is over it */
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
            position: relative;
            z-index: 10;
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
            position: relative;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <!-- IMG Watermark -->
        <img src={{ public_path('default-pic/approved-pic.png') }} class="watermark" alt="Approved Watermark">

        <div class="form-header" style="text-align: center;">
            <h1>Approved Student Absence Form</h1>
            <p>This absence request has been approved.</p>
        </div>
        
        <div class="form-section">
            <h2>Student Information</h2>
            <div class="info-group">
                <span class="info-label">Student Name:</span>
                <span class="info-value">{{ $sender_name }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Student ID:</span>
                <span class="info-value">{{ $student_id }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Program:</span>
                <span class="info-value">{{ $program }}</span>
            </div>
        </div>
        
        <div class="form-section">
            <h2>Absence Details</h2>
            <div class="info-group">
                <span class="info-label">Start Date:</span>
                <span class="info-value">{{ $date_from }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">End Date:</span>
                <span class="info-value">{{ $date_to }}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Reason for Absence:</span>
                <span class="info-value">{{ $reason }}</span>
            </div>
        </div>
        
        <div class="form-section">
            <h2>Approval Details</h2>
            <div class="approval-section">
                <div class="info-group">
                    <span class="info-label">Approved By:</span>
                    <span class="info-value">{{ $prefect_name }}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Approval Date:</span>
                    <span class="info-value">{{ $date_approve }}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Status:</span>
                    <span class="info-value" style="color: #28a745; font-weight: bold;">{{ $status }}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Note From The Prefect:</span>
                    <span class="info-value">{{ $note }}</span>
                </div>
            </div>
        </div>
                
        <div class="footer">
            <p>From the Office of the Prefect of the Higher Education Department of the Pilar College Of Zamboanga City.</p>
        </div>
    </div>
</body>
</html>
