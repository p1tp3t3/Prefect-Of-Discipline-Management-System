<div style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4; width: 100%;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ccc; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAABg1BMVEX///8AAAAAAIUAAIIAAHwAAH'); background-repeat: no-repeat; background-position: center; background-size: 200px;">
          <tr>
            <td style="padding: 20px; background-color: {{ ($status != 'disapprove') ? '#22c02a;' : '#c62828;' }} color: white; text-align: center;">
              <h2 style="margin: 0;">Gatepass Request {{ ucwords($status) }}d</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; color: #333;">
              <p>Dear {{ $requester }},</p>
              <p>Your gatepass request submitted on <strong>{{ $date_requested }}</strong> has been <strong>{{ ucwords($status) }}d</strong>.</p>
              <p>Expiration will be on <strong>{{ $date_time_expiration }}</strong>.</p>
              <p>For more details, please check your student dashboard.</p>
              <p>Thank you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; color: #333;">
              <p style="margin-bottom:0; font-size:16px; line-height:1.6;">
                  Best regards,<br>
                  <strong>{{ $prefect_name }}</strong><br>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 15px; background-color: #f8f9fa; text-align: center; font-size: 12px; color: #666;">
              Pilar College of Zamboanga City – Prefect of Discipline
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
