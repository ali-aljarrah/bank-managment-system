<!DOCTYPE html>
<html>
<head>
    <title>Bank managment</title>
</head>
<body>
    <h1>{{ $mailData['title'] }}</h1>
    <p>Dear {{ $mailData['name'] }}</p>
    <p>Your account email: {{ $mailData['email'] }}</p>
    <p>Your account password: {{ $mailData['password'] }}</p>
</body>

</html>