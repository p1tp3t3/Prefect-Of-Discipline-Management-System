<div style="margin:0; padding: 10px 0; font-family: Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff;">
        <tr>
            <td style="padding:30px 20px; background-color: rgb(63, 63, 219); color:#ffffff; text-align:center;">
                <img src={{ $message->embed(resource_path('js/images/pilar.png')) }} width="100" height="100" style="margin: 0 auto;" alt="" srcset="">
                <h1 style="margin:0; font-size:24px;">OFFICE CALL BY THE PREFECT OF DISCIPLINE</h1>
            </td>
        </tr>
        <tr>
            <td style="padding:30px 20px;">
                <p style="margin-bottom:20px; font-size:16px; line-height:1.6;">Dear {{ $student_name }},</p>
                <p style="margin-bottom:20px; font-size:16px; line-height:1.6;">
                    {{ $call_in_reason }}
                </p>
                <p style="margin-bottom:0; font-size:16px; line-height:1.6;">
                    Best regards,<br>
                    <strong>{{ $prefect_name }}</strong><br>
                    Pilar College Prefect of Discipline of the Higher Education Department
                </p>
            </td>
        </tr>
    </table>
</div>
