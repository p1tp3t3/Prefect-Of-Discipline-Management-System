<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Repeat Violation Risk Notification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:6px; font-family:Arial, Helvetica, sans-serif; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#1f4e79; padding:16px 24px; color:#ffffff;">
              <h1 style="margin:0; font-size:20px;">Repeat Violation Risk Alert</h1>
              <p style="margin:4px 0 0; font-size:13px; opacity:0.9;">Program: {{ $program_name }}</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:20px 24px 10px; font-size:14px; color:#333;">
              <p style="margin:0 0 8px;">Dear Faculty and Program Head,</p>
              <p style="margin:0 0 12px; line-height:1.5;">
                Below is the current repeat violation risk assessment for the following student:
              </p>
            </td>
          </tr>

          <!-- Student Info with Photo -->
          <tr>
            <td style="padding:0 24px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="80" align="center" style="padding-right:16px;">
                    <img src="{{ $profile_picture }}" alt="Student Photo" width="80" height="80" style="border-radius:50%; object-fit:cover; border:2px solid #ddd;">
                  </td>
                  <td valign="top" style="font-size:14px; color:#333;">
                    <p style="margin:0 0 6px;"><strong>Student Name:</strong> {{ $student_name }}</p>
                    <p style="margin:0 0 6px;"><strong>Student ID:</strong> {{ $student_id }}</p>
                    <p style="margin:0 0 6px;"><strong>Program:</strong> {{ $program_name }}</p>
                    <p style="margin:0 0 6px;"><strong>Year Level:</strong> {{ $year_level }}</p>
                    <p style="margin:0 0 6px;"><strong>Total Violations:</strong> {{ $violation_count }}</p>
                    <p style="margin:0;"><strong>Total Repeated Violations:</strong> {{ $repeat_violation_count }}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Risk Section -->
          <tr>
            <td style="padding:8px 24px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:12px 16px; background-color:#f8f9fb; border-radius:4px; border:1px solid #d9dde7;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size:14px; font-weight:bold; color:#333;">Current Risk:</td>
                        <td align="right">
                          <!-- Risk badge (set color based on % range) -->
                          <span style="
                            display:inline-block;
                            padding:6px 12px;
                            border-radius:16px;
                            font-size:12px;
                            font-weight:bold;
                            text-transform:uppercase;
                            color:#fff;
                            background-color:#{{ $risk_color }};">
                            {{ $percentage }}%
                          </span>
                        </td>
                      </tr>

                      <!-- Progress Bar -->
                      <tr>
                        <td colspan="2" style="padding-top:12px;">
                          <div style="background:#e5e5e5; border-radius:12px; overflow:hidden; height:10px;">
                            <div style="
                              height:10px;
                              width:{{ $percentage }}%;
                              background-color:#{{ $risk_color }};
                              border-radius:12px 0 0 12px;
                            "></div>
                          </div>
                        </td>
                      </tr>

                      <!-- Risk Message -->
                      <tr>
                        <td colspan="2" style="padding-top:12px; font-size:13px; color:#555; line-height:1.5;">
                          {{ $message }}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Legend -->
          <tr>
            <td style="padding:0 24px 18px;">
              <p style="margin:0 0 6px; font-size:13px; font-weight:bold;">Risk Percentage Guide</p>
              <table role="presentation" width="100%" style="font-size:12px; color:#333;">
                <tr><td><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#1f7a1f; margin-right:6px;"></span><strong>Low (0–30%)</strong> – minimal concern.</td></tr>
                <tr><td><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#f0ad4e; margin-right:6px;"></span><strong>Medium (31–60%)</strong> – review pattern of violations.</td></tr>
                <tr><td><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#d9534f; margin-right:6px;"></span><strong>High (61–85%)</strong> – immediate action advised.</td></tr>
                <tr><td><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#8b0000; margin-right:6px;"></span><strong>Critical (86–100%)</strong> – urgent intervention required.</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:14px 24px 20px; font-size:11px; color:#888; border-top:1px solid #eee;">
              <p style="margin:0;">This is an automated message from the prefect of discipline management system. Please do not reply directly.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
