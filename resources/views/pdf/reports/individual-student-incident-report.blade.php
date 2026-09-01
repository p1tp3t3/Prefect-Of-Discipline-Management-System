<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student Incident Report</title>
<style>
  body {
    font-family: DejaVu Sans, sans-serif;
    font-size: 12px;
    margin: 25px;
    color: #222;
  }

  /* --- HEADER --- */
  .report-header {
    width: 100%;
    border-bottom: 3px solid #003366;
    margin-bottom: 15px;
    padding-bottom: 5px;
  }

  .report-header td {
    vertical-align: middle;
  }

  .report-header img {
    width: 80px;
  }

  .school-name {
    font-size: 16px;
    font-weight: bold;
    color: #003366;
    margin-bottom: 2px;
  }

  .school-info {
    font-size: 11px;
    color: #555;
  }

  .title-box {
    text-align: center;
    margin: 15px 0 10px;
  }

  .title-box h2 {
    font-size: 16px;
    color: #003366;
    margin: 0;
  }

  /* --- PROFILE BOX --- */
  .profile-section {
    border: 1px solid #003366;
    border-radius: 4px;
    background-color: #f3f7fb;
    padding: 8px 10px;
    margin-top: 10px;
  }

  .profile-table {
    width: 100%;
    border-collapse: collapse;
  }

  .profile-table td {
    padding: 5px 8px;
    vertical-align: top;
    font-size: 12px;
  }

  .profile-table .label {
    font-weight: bold;
    color: #003366;
    width: 25%;
  }

  .profile-photo {
    width: 110px;
    text-align: center;
  }

  .profile-photo img {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #ccc;
  }

  /* --- INCIDENTS TABLE --- */
  .incidents {
    width: 100%;
    border-collapse: collapse;
    margin-top: 18px;
  }

  .incidents th {
    background-color: #003366;
    color: white;
    padding: 6px;
    text-align: left;
    font-size: 12px;
  }

  .incidents td {
    border: 1px solid #ddd;
    padding: 6px;
    font-size: 11px;
  }

  .incidents tr:nth-child(even) {
    background-color: #f8f9fb;
  }

  .category-minor {
    color: #856404;
  }

  .category-major {
    color: #b71c1c;
    font-weight: bold;
  }

  /* --- FOOTER --- */
  footer {
    margin-top: 25px;
    font-size: 11px;
    text-align: right;
    color: #555;
  }

  hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 15px 0;
  }
</style>
</head>
<body>

  {{-- HEADER --}}
  <table class="report-header">
    <tr>
      <td style="width: 90px;">
        <img src="{{ public_path('default-pic/pilar.png') }}" alt="Logo">
      </td>
      <td>
        <div class="school-name">PILAR COLLEGE OF ZAMBOANGA CITY, INC.</div>
        <div class="school-info">R.T. Lim Boulevard, Zamboanga City</div>
        <div class="school-info">Higher Education Department</div>
      </td>
    </tr>
  </table>

  {{-- TITLE --}}
  <div class="title-box">
    <h2>Student Incident Report</h2>
    <div style="font-size: 11px; color: #555;">
      From <strong>{{ \Carbon\Carbon::parse($from)->format('F d, Y') }}</strong> 
      to <strong>{{ \Carbon\Carbon::parse($to)->format('F d, Y') }}</strong>
    </div>
  </div>

  {{-- STUDENT PROFILE --}}
  <div class="profile-section">
    <table class="profile-table">
      <tr>
        {{-- PROFILE PICTURE --}}
        <td class="profile-photo" rowspan="3">
          <img 
            src="{{ $profile_picture }}" 
            alt="Student Photo">
        </td>

        {{-- NAME + ID --}}
        <td class="label">Student Name:</td>
        <td>{{ $student_name }}</td>
        <td class="label">Student ID:</td>
        <td>{{ $student_id }}</td>
      </tr>
      <tr>
        <td class="label">Program:</td>
        <td>{{ $program }}</td>
        <td class="label">Status:</td>
        <td>{{ $civil_status }}</td>
      </tr>
    </table>
  </div>

  {{-- INCIDENT RECORDS --}}
  <h4 style="margin-top:15px; color:#003366;">Incident Records</h4>
  <table class="incidents">
    <thead>
      <tr>
        <th style="width:4%;">#</th>
        @if(request('type') == 'incident')
          <th style="width:18%;">Complainant Name</th>
          <th style="width:12%;">Incident Reported</th>
        @else
          <th style="width:12%;">Violation</th>
          <th style="width:12%;">Status</th>
        @endif
        <th style="width:15%;">Date / Time</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($data as $d)
        <tr>
          <td>{{ $d['i'] }}</td>
          @if(request('type') == 'incident')
            <td>{{ $d['complainant_name'] }}</td>
            <td>{{ $d['incident'] }}</td>
          @else
            <td>{{ $d['violation'] }}</td>
            <td>{{ $d['status'] }}</td>
          @endif
          <td>{{ $d['date_time'] }}</td>
        </tr>
      @empty
        <tr>
          <td colspan="6" style="text-align:center; padding:10px;">No incident records found.</td>
        </tr>
      @endforelse
    </tbody>
  </table>
</body>
</html>
